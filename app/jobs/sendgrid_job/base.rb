# frozen_string_literal: true

module SendgridJob
  class Base < ApplicationJob
    queue_as :sendgrid
    sidekiq_options retry: 5
    sidekiq_retry_in { |count, _e, _jobhash| retry_interval(count + 1) }

    sidekiq_retries_exhausted do |job, _e|
      Sidekiq.logger.warn "Failed #{job['class']} with #{job['args']}: #{job['error_message']}"
    end

    class << self
      def retry_interval(count)
        (15 * (count**3)) + (rand(10) * count)
      end
    end
  end
end
