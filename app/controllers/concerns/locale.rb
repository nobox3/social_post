# frozen_string_literal: true

module Locale
  extend ActiveSupport::Concern

  def switch_locale(&)
    locale = detect_locale

    cookies[:locale] = locale
    I18n.with_locale(locale.to_sym, &)
  end

  def set_locale(locale) # rubocop:disable Naming/AccessorMethodName
    locale = check_available(locale) || detect_locale

    cookies[:locale] = locale
    I18n.locale = locale.to_sym
  end

  def detect_locale
    locale = user_signed_in? ? current_user.language : (params[:locale] || cookies[:locale] || env_language)

    check_available(locale) || I18n.default_locale
  end

  def check_available(locale)
    locale if locale&.to_sym.in?(I18n.available_locales)
  end

  def env_language
    request.env['HTTP_ACCEPT_LANGUAGE']&.scan(/^[a-z]{2}/)&.first
  end
end
