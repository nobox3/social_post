# frozen_string_literal: true

require 'sendgrid-ruby'

module SendgridService
  class Mail
    def initialize(_settings = {})
      # do nothing so far, but must define this because mail gem calls "new" with settings (meant if "initialize" omitted, raises argument error)
    end

    def deliver!(mail)
      personalization = SendGrid::Personalization.new

      personalization.subject = mail.subject

      Array.wrap(mail.to).each do |email|
        personalization.add_to(SendGrid::Email.new(email:))
      end

      Array.wrap(mail.cc).each do |email|
        personalization.add_cc(SendGrid::Email.new(email:))
      end

      Array.wrap(mail.bcc).each do |email|
        personalization.add_bcc(SendGrid::Email.new(email:))
      end

      # personalization.add_header(SendGrid::Header.new(key: :category, value: ENV.fetch('APP_HOST', 'localhost')))

      sg_mail = SendGrid::Mail.new
      sg_mail.from = SendGrid::Email.new(email: mail.from.first)
      sg_mail.subject = mail.subject

      sg_mail.add_personalization(personalization)

      (mail.multipart? ? mail.parts : [mail]).each do |part|
        sg_mail.add_content(SendGrid::Content.new(type: part.mime_type, value: part.body.raw_source))
      end

      tracking_settings = SendGrid::TrackingSettings.new
      tracking_settings.open_tracking = SendGrid::OpenTracking.new(enable: true)
      tracking_settings.subscription_tracking = SendGrid::SubscriptionTracking.new(enable: false)
      sg_mail.tracking_settings = tracking_settings

      SendgridService::Api.new.request_mail_post(sg_mail.to_json)
    end
  end
end
