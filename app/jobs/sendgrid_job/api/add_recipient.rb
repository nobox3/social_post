# frozen_string_literal: true

module SendgridJob
  module Api
    class AddRecipient < SendgridJob::Api::Base
      def perform(user)
        data = parse_response!(@api.request_recipients_post([user]))

        return if (recipient_ids = data['persisted_recipients']).blank?

        user.notification_items.list_ids.each { |list_id| AddToList.perform_later(list_id, recipient_ids) }
      end
    end
  end
end
