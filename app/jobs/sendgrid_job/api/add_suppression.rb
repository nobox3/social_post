# frozen_string_literal: true

module SendgridJob
  module Api
    class AddSuppression < SendgridJob::Api::Base
      def perform(group_id, email)
        parse_response!(@api.request_suppressions_post(group_id, [email]))
      end
    end
  end
end
