# Check mailer and API are disabled
errors = []
errors << 'ActionMailer::Base' if ActionMailer::Base.perform_deliveries
errors << 'SendgridService::Api' unless SendgridService::Api.api_disabled?

if errors.any?
  abort "Aborted to create seeds. Mailer or API are enabled, please disable it: #{errors.join(', ')}"
end
