# frozen_string_literal: true

module SendgridJob
  module Api
    class UpdateSuppression < SendgridJob::Api::Base
      def perform(notification_setting, email)
        return if email != notification_setting.user.email || !notification_setting.user.enabled?

        group_id = notification_setting.notification_item.unsubscribe_group_id

        if notification_setting.enabled?
          response = @api.request_suppressions_delete(group_id, email)
        else
          response = @api.request_suppressions_post(group_id, [email])
        end

        parse_response!(response)
      end
    end
  end
end
