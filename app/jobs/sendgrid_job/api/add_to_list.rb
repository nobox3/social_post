# frozen_string_literal: true

module SendgridJob
  module Api
    class AddToList < SendgridJob::Api::Base
      def perform(list_id, recipient_ids)
        parse_response!(@api.request_list_recipients_post(list_id, recipient_ids))
      end
    end
  end
end
