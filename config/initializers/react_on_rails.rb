# frozen_string_literal: true

# https://www.shakacode.com/react-on-rails/docs/guides/configuration/

ReactOnRails.configure do |config|
  # config.trace = Rails.env.development?
  # config.random_dom_id = false
  config.node_modules_location = ""
  # config.build_production_command = nil

  # SERVER RENDERING OPTIONS
  config.server_bundle_js_file = ""

  # FILE SYSTEM BASED COMPONENT REGISTRY
  config.components_subdirectory = nil
  config.auto_load_bundle = false

  # I18N OPTIONS
  config.i18n_yml_dir = Rails.root.join('config', 'locales')
  config.i18n_output_format = 'json'

  # CLIENT RENDERING OPTIONS
  config.prerender = false

  # TEST CONFIGURATION OPTIONS
  config.build_test_command = "NODE_ENV=test RAILS_ENV=test bin/shakapacker"
end
