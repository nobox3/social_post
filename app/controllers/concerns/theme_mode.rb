# frozen_string_literal: true

module ThemeMode
  extend ActiveSupport::Concern

  included do
    helper_method :theme_modes, :user_theme_mode
  end

  def theme_modes
    User.theme_modes
  end

  def user_theme_mode
    current_user&.theme_mode || session[:user_theme_mode] || theme_modes.first.first
  end

  def store_user_theme_mode(theme_mode)
    session[:user_theme_mode] = theme_mode
  end
end
