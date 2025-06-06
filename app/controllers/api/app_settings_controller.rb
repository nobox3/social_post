# frozen_string_literal: true

module Api
  class AppSettingsController < ApplicationController
    def update_locale
      language = params[:language]

      current_user&.update!(language:)
      set_locale(language)

      render json: {}
    end

    def update_theme_mode
      theme_mode = params[:theme_mode]

      current_user&.update!(theme_mode:)
      store_user_theme_mode(theme_mode)

      render json: {}
    end
  end
end
