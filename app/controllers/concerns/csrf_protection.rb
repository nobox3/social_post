# frozen_string_literal: true

module CsrfProtection
  extend ActiveSupport::Concern

  included do
    protect_from_forgery with: :exception, prepend: true

    rescue_from ActionController::InvalidAuthenticityToken, with: :invalid_request_by_forgery
    rescue_from ActionController::InvalidCrossOriginRequest, with: :invalid_request_by_forgery
  end

  def invalid_request_by_forgery(e)
    Rails.logger.warn e.message
    error = t('activerecord.errors.messages.user_not_authorized', default: 'User not authorized')

    respond_to do |format|
      format.json { render json: { error: }, status: :unauthorized }

      format.html do
        flash[:error] = error
        redirect_to root_path
      end
    end
  end
end
