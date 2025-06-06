# frozen_string_literal: true

module BasicAuth
  extend ActiveSupport::Concern

  class NoSetBasicAuthNameOrPasswordError < StandardError; end

  def basic_auth
    if (name = ENV.fetch('BASIC_AUTH_USERNAME', nil)) && (password = ENV.fetch('BASIC_AUTH_PASSWORD', nil))
      http_basic_authenticate_or_request_with(name:, password:)
    else
      message = 'No set basic auth name or password'
      flash[:alert] = message

      raise NoSetBasicAuthNameOrPasswordError, message
    end
  end
end
