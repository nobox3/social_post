# frozen_string_literal: true

module SendgridService
  module Webhook
    class Subscription
      class << self
        def update(payload)
          JSON.parse(payload, symbolize_names: true).each do |params|
            if (enabled = get_enabled_by_event(params[:event])).nil?
              Rails.logger.error "Groupe subscription event not found in params: #{params}"
            else
              update_user_setting_by_hook(params, enabled)
            end
          end
        rescue JSON::ParserError => e
          Rails.logger.error "Failed to parse payload: #{e.message}"
        end

        def update_user_setting(params, enabled)
          notification_item = NotificationItem.find_by!(unsubscribe_group_id: params[:asm_group_id])
          notification_setting = User.find_by!(email: params[:email]).notification_settings.find_by!(notification_item:)

          if params[:timestamp] > notification_setting.updated_at.to_i
            notification_setting.update_columns(enabled:, updated_at: Time.zone.now)
          end
        end

        private

          def update_user_setting_by_hook(params, enabled)
            update_user_setting(params, enabled)
          rescue ActiveRecord::RecordNotFound => e
            Rails.logger.warn "Failed to update user setting with #{params}: #{e.message}"
          rescue StandardError => e
            Rails.logger.info "Retry to update user setting with #{params}: #{e.message}"
            SendgridJob::RetrySubscriptionUpdate.set(wait: 10.seconds).perform_later(params, enabled)
          end

          def get_enabled_by_event(event)
            case event
            when 'group_unsubscribe'
              false
            when 'group_resubscribe'
              true
            end
          end
      end
    end
  end
end
