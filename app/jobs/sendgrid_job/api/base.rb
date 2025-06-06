# frozen_string_literal: true

module SendgridJob
  module Api
    class ApiResponseError < StandardError; end

    class Base < SendgridJob::Base
      sidekiq_retry_in do |count, e, _jobhash|
        next :kill unless e.is_a?(ApiResponseError)

        retry_interval(count + 1)
      end

      before_perform { @api = SendgridService::Api.new }

      protected

        def parse_response!(response)
          code = response&.status_code
          data = response&.body.present? ? JSON.parse(response.body) : {}

          return data if code&.start_with?('2')

          message = data['errors']&.pluck('message')&.join(', ')

          raise ApiResponseError, "#{code}: #{message.presence || 'Unknown error'}"
        end
    end
  end
end
