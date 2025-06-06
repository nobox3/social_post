# frozen_string_literal: true

module SendgridJob
  module Api
    class UpdateRecipient < SendgridJob::Api::Base
      def perform(user, attributes = nil)
        return if user.discarded?

        parse_response!(@api.request_recipients_patch([user], attributes))
      end
    end
  end
end
