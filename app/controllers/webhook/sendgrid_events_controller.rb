# frozen_string_literal: true

require 'sendgrid-ruby'

module Webhook
  class SendgridEventsController < ApplicationController
    class SignatureNotVerifiedError < StandardError; end

    skip_before_action :verify_authenticity_token
    before_action :read_request_body

    rescue_from SignatureNotVerifiedError, with: :signature_not_verified

    def update_subscription
      verify_signature!(ENV.fetch('SENDGRID_SUBSCRIPTION_WEBHOOK_VERIFICATION_KEY', nil))
      SendgridService::Webhook::Subscription.update(@payload)
    end

    private

      def read_request_body
        request.body.rewind
        @payload = request.body.read
      end

      # https://github.com/sendgrid/sendgrid-ruby/blob/main/lib/sendgrid/helpers/eventwebhook/eventwebhook.rb
      # https://github.com/sendgrid/sendgrid-ruby/blob/main/examples/helpers/eventwebhook/example.rb
      def verify_signature!(public_key)
        event_webhook = SendGrid::EventWebhook.new
        ec_public_key = event_webhook.convert_public_key_to_ecdsa(public_key)
        signature = request.env[SendGrid::EventWebhookHeader::SIGNATURE]
        timestamp = request.env[SendGrid::EventWebhookHeader::TIMESTAMP]

        if event_webhook.verify_signature(ec_public_key, @payload, signature, timestamp)
          head :no_content
        else
          raise SignatureNotVerifiedError, "Signature not verified: #{@payload}"
        end
      end

      def signature_not_verified(e)
        logger.error e.message
        head :unauthorized
      end
  end
end
