require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
# require "action_mailbox/engine"
# require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module SocialPost
  class Application < Rails::Application
    config.load_defaults 7.2

    config.active_support.message_serializer = :json

    config.time_zone = ENV.fetch("TIME_ZONE", "UTC")
    config.active_record.default_timezone = :local

    config.i18n.default_locale = ENV.fetch("DEFAULT_LOCALE", :en).to_sym
    config.i18n.available_locales = %i[en ja]
    config.i18n.load_path += Dir[Rails.root.join("config", "locales_common", "**", "*.yml")]
    config.active_model.i18n_customize_full_message = true

    config.active_job.queue_adapter = :sidekiq
    config.active_storage.queues.analysis = :active_storage_analysis
    config.active_storage.queues.purge = :active_storage_purge
    config.action_mailer.deliver_later_queue_name = :mailers
    config.action_mailer.default_options = { from: proc { "portfolio <portfolio@example.com>" } }

    config.generators do |g|
      g.helper false
      g.assets false
      g.skip_routes true
      g.system_tests nil
      g.test_framework :rspec
      g.view_specs false
      g.controller_specs false
      g.helper_specs false
    end
  end
end
