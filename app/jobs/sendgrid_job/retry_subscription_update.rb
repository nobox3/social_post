# frozen_string_literal: true

module SendgridJob
  class RetrySubscriptionUpdate < Base
    def perform(params, enabled)
      SendgridService::Webhook::Subscription.update_user_setting(params, enabled)
    end
  end
end
