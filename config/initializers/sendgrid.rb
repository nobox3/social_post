Rails.configuration.to_prepare do
  ActionMailer::Base.add_delivery_method :sendgrid, SendgridService::Mail
end
