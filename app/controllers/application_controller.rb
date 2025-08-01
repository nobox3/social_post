# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include CsrfProtection
  include PunditAuthorization
  include I18nMessageHelper
  include Locale
  include ThemeMode
  include BasicAuth

  respond_to :html, :json

  before_action :basic_auth, if: -> { !Rails.env.local? && ENV.fetch('ENABLE_BASIC_AUTH', nil) == 'true' }
  # About store_location_for:
  # https://github.com/heartcombo/devise/wiki/How-To:-Redirect-back-to-current-page-after-sign-in,-sign-out,-sign-up,-update
  before_action -> { store_location_for(:user, request.fullpath) }, if: :storable_location?
  around_action :switch_locale
  around_action :render_common, unless: :devise_controller?

  attr_reader :decorator

  helper_method :i18n_params_for_path, :props_on_render, :decorator

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
      @props[:page_component_path] ||= "/#{controller_path}" + ((action = action_name) == 'index' ? '' : "/#{action}")
      @props[:current_user] = serialize_current_user if !@props[:current_user] && user_signed_in?
      @props
    end

    def i18n_params_for_path
      return @i18n_params_for_path if @i18n_params_for_path

      path = request.path
      key = nil
      interpolation = {}

      if path == root_path
        key = 'top'
      elsif (decorator_params = decorator&.i18n_params_for_path).present?
        key = to_dot_chain_path(path, decorator_params[:path_replacements])
        interpolation = decorator_params[:interpolation] if decorator_params[:interpolation]
      end

      @i18n_params_for_path = { key: key || to_dot_chain_path(path), interpolation: }
    end

    def to_dot_chain_path(path, replacements = nil)
      path = path[1..]

      return path.tr('/', '.') if replacements.blank?

      segments = path.split('/')

      replacements.each { |at, replacement| segments[at] = replacement if segments[at] }
      segments.compact.join('.')
    end

    def render_common
      yield
    rescue ActionController::MissingExactTemplate
      render '/common'
    end
end
