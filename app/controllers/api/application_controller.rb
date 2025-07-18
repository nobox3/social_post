# frozen_string_literal: true

module Api
  class ApplicationController < ActionController::Base
    include CsrfProtection
    include PunditAuthorization
    include I18nMessageHelper
    include Locale
    include ThemeMode

    around_action :switch_locale

    rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
    rescue_from ActiveRecord::RecordNotDestroyed, with: :record_not_destroyed
    rescue_from Discard::RecordNotDiscarded, with: :record_not_discarded

    private

      def record_invalid(e)
        render_invalid_error(e)
      end

      def record_not_destroyed(e)
        e.record.errors.any? ? render_invalid_error(e) : render_system_error(e)
      end

      def record_not_discarded(e)
        e.record&.errors.present? ? render_invalid_error(e) : render_system_error(e)
      end

      def render_invalid_error(e)
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      def render_system_error(e)
        logger.info e.message
        head :internal_server_error
      end
  end
end
