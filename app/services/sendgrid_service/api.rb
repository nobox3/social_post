# frozen_string_literal: true

require 'sendgrid-ruby'

module SendgridService
  class Api
    RECIPIENT_PARAMS = {
      username: [:user_name, ->(u) { u.username.to_s }].freeze,
    }.freeze

    class NoApiKeyError < KeyError; end

    # --------------------
    # Class Method
    # --------------------
    class << self
      def api_key(strict: false)
        value = ENV.fetch('SENDGRID_API_KEY', nil)

        strict && value.blank? ? raise(NoApiKeyError, 'key not found or blank: "SENDGRID_API_KEY"') : value
      end

      # to change enable or disable globally
      attr_accessor :disable_api

      Api.disable_api = Api.api_key.blank? || Rails.env.local?

      # e.g. If you need to use in development, set like following.
      # Api.disable_api = Api.api_key.blank? || Rails.env.test?

      alias api_disabled? disable_api

      def add_recipient(user)
        return if api_disabled?

        SendgridJob::Api::AddRecipient.perform_later(user)
      end

      def update_recipient(user, attributes = nil)
        return if api_disabled?

        SendgridJob::Api::UpdateRecipient.perform_later(user, attributes)
      end

      def delete_recipient(user)
        return if api_disabled?

        SendgridJob::Api::DeleteRecipient.perform_later(user.email, user.notification_items.unsubscribe_group_ids(false))
      end

      def change_email(user, old_email)
        return if api_disabled?

        add_recipient(user)
        update_suppression(user.notification_settings.subscription.disabled, user.email)

        SendgridJob::Api::DeleteRecipient.perform_later(old_email, user.notification_items.unsubscribe_group_ids(false))
      end

      def add_suppression(group_ids, email)
        return if api_disabled?

        group_ids.each { |group_id| SendgridJob::Api::AddSuppression.perform_later(group_id, email) }
      end

      def update_suppression(notification_settings, email)
        return if api_disabled?

        notification_settings.each { |setting| SendgridJob::Api::UpdateSuppression.perform_later(setting, email) }
      end

      def to_str_words(column, collection)
        collection.pluck(:id, column).map { |item| item.join('_') }.join(' ')
      end

      def to_str_words_with_enum(column, collection, enum_hash)
        collection.pluck(column).map { |key| "#{enum_hash[key]}_#{key}" }.join(' ')
      end
    end

    # --------------------
    # Instance Method
    # --------------------
    # https://github.com/sendgrid/sendgrid-ruby/blob/main/USAGE.md
    def initialize
      raise StandardError, 'SendgridService::Api is disabled' if Api.api_disabled?

      @api_key = Api.api_key(strict: true)
    end

    def request_recipients_post(users)
      recipients.post(request_body: generate_recipient_params(users))
    end

    def request_list_recipients_post(list_id, recipient_ids)
      list_recipients(list_id).post(request_body: recipient_ids)
    end

    def request_recipients_patch(users, attributes = nil)
      recipients.patch(request_body: generate_recipient_params(users, attributes))
    end

    def request_recipients_delete(emails)
      recipients.delete(request_body: emails.map { |email| encode_to_recipient_id(email) })
    end

    def request_suppressions_post(group_id, emails)
      suppressions(group_id).post(request_body: { recipient_emails: emails })
    end

    def request_suppressions_delete(group_id, email)
      suppressions(group_id)._(email).delete
    end

    def request_mail_post(mail_data)
      sg.client.mail._('send').post(request_body: mail_data)
    end

    def request_all_lists
      sg.client.contactdb.lists.get
    end

    private

      def sg
        @sg ||= SendGrid::API.new(api_key: @api_key)
      end

      def recipients
        sg.client.contactdb.recipients
      end

      def list_recipients(list_id)
        sg.client.contactdb.lists._(list_id).recipients
      end

      def suppressions(group_id)
        sg.client.asm.groups._(group_id).suppressions
      end

      def encode_to_recipient_id(email)
        Base64.urlsafe_encode64(email)
      end

      def generate_recipient_params(users, attributes = nil)
        attributes = RECIPIENT_PARAMS.keys if attributes.blank?

        users.map do |user|
          attributes.each_with_object({ email: user.email }) do |attribute, hash|
            field, value = RECIPIENT_PARAMS[attribute]
            hash[field] = value.call(user) if field && value
          end
        end
      end
  end
end
