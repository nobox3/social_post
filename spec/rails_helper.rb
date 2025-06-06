# https://github.com/rspec/rspec-rails/blob/main/lib/generators/rspec/install/templates/spec/rails_helper.rb

require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'

abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'
require "validates_email_format_of/rspec_matcher"

Rails.root.glob('spec/support/**/*.rb').sort_by(&:to_s).each { |f| require f }

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.fixture_paths = [Rails.root.join('spec/fixtures')]
  config.use_transactional_fixtures = true
  config.file_fixture_path = 'spec/fixtures'

  # config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
  # config.filter_gems_from_backtrace("gem name")

  config.include FactoryBot::Syntax::Methods
  config.include Devise::Test::IntegrationHelpers, type: :request
  config.include ActiveJob::TestHelper
  config.include OmniauthHelper
  config.include RequestSpecHelper, type: :request

  config.define_derived_metadata do |meta|
		meta[:aggregate_failures] = true unless meta.key?(:aggregate_failures)
	end

  # https://www.shakacode.com/react-on-rails/docs/guides/rspec-configuration/
  ReactOnRails::TestHelper.configure_rspec_to_compile_assets(config, :requires_webpack_assets)

  config.define_derived_metadata(file_path: %r{spec/(system|requests)}) do |meta|
    meta[:requires_webpack_assets] = true
  end
end

# FactoryBot::SyntaxRunner.class_eval do
#   include ActionDispatch::TestProcess
# end

RSpec::Matchers.define_negated_matcher :not_change, :change

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

OmniAuth.config.test_mode = true
OmniAuth.config.before_callback_phase = proc do |env|
  env['omniauth.params'] = Rails.application.env_config['omniauth.params'] || {}
end
