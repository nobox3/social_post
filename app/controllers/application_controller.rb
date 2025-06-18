# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include CsrfProtection
  include PunditAuthorization
  include I18nMessageHelper
  include Locale
  include ThemeMode
  include BasicAuth

  respond_to :html, :json

  before_action :basic_auth, unless: -> { Rails.env.local? }
  # About store_location_for:
  # https://github.com/heartcombo/devise/wiki/How-To:-Redirect-back-to-current-page-after-sign-in,-sign-out,-sign-up,-update
  before_action -> { store_location_for(:user, request.fullpath) }, if: :storable_location?
  around_action :switch_locale
  around_action :render_common, unless: :devise_controller?

  attr_reader :props, :decorator

  helper_method :props, :props_on_render, :decorator

  protected

    def user_authenticate?
      warden.authenticate?(scope: :user)
    end

    def serialize_current_user(options = {})
      AccountSerializer.serialize_current_user(current_user, options)
    end

    def decorate(obj)
      @decorator = "#{obj.class}Decorator".safe_constantize&.new(obj)
    end

  private

    def user_not_authorized(e)
      flash[:error] = policy_error_message(e)

      redirect_to(request.referer || new_user_session_path)
    end

    def navigational_get_request?
      request.get? && !request.xhr? && is_navigational_format?
    end

    def storable_location?
      navigational_get_request? && !devise_controller? && request.path != root_path
    end

    def props_on_render
      @props ||= {}

      if (flash_hash = flash.to_hash.slice('notice', 'alert', 'success', 'error')).any?
        @props[:flash_messages] = flash_hash.map { |type, text| { type:, text: } }
      end

      @props[:i18n_params_for_path] ||= i18n_params_for_path
      @props[:page_component_path] ||= (action = action_name) == 'index' ? controller_path : "#{controller_path}/#{action}"
      @props[:current_user] = serialize_current_user if !@props[:current_user] && user_signed_in?
      @props
    end

    def i18n_params_for_path
      path = request.path
      interpolation = {}

      if (decorator_params = decorator&.i18n_params_for_path)
        interpolation = decorator_params[:interpolation]
        segments = decorator_params[:removed_segments]

        path.gsub!(%r{/(#{Array.wrap(segments).join('|')})}, '')
      end

      { key: path[1..].tr('/', '.').presence || :default, interpolation: }
    end

    def render_common
      yield
    rescue ActionController::MissingExactTemplate
      render '/common'
    end
end
