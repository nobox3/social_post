# frozen_string_literal: true

module PunditAuthorization
  extend ActiveSupport::Concern
  include Pundit::Authorization

  included do
    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  end

  def user_not_authorized(e)
    render json: { errors: policy_error_message(e) }, status: :forbidden
  end

  def policy_error_message(e)
    if e.policy
      t("#{e.policy.class.to_s.underscore}.#{e.query}", scope: :pundit, default: :default)
    else
      e.message
    end
  end
end
