# frozen_string_literal: true

module PunditAuthorization
  extend ActiveSupport::Concern
  include Pundit::Authorization

  included do
    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  end

  def user_not_authorized(e)
    self.status = :forbidden

    respond_to do |format|
      format.json { render json: { error: policy_error_message(e) } }

      format.html do
        @props = { page_component_path: '/errors/show', status: }
        render '/common'
      end
    end
  end

  def policy_error_message(e)
    if e.policy
      t("#{e.policy.class.to_s.underscore}.#{e.query}", scope: :pundit, default: :default)
    else
      e.message
    end
  end
end
