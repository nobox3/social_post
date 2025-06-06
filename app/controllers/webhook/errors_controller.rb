# frozen_string_literal: true

module Webhook
  # called from config/initializers/exceptions_app.rb
  class ErrorsController < ActionController::Base # rubocop:disable Rails/ApplicationController
    include ErrorsControllerBase

    layout false
  end
end
