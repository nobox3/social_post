# frozen_string_literal: true

module SendgridJob
  module Api
    class DeleteRecipient < SendgridJob::Api::Base
      def perform(email, group_ids)
        parse_response!(@api.request_recipients_delete([email]))
        group_ids.each { |group_id| DeleteSuppression.perform_later(group_id, email) }
      end
    end
  end
end
