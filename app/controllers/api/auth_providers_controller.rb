# frozen_string_literal: true

module Api
  class AuthProvidersController < ApplicationController
    before_action :authenticate_user!
    before_action :set_auth_provider, only: %i[destroy]

    def destroy
      authorize(@auth_provider)
      @auth_provider.destroy!

      render json: { flash_message: flash_message(:deleted, provider: @auth_provider.human_enum_name(:provider)) }
    end

    private

      def set_auth_provider
        @auth_provider = AuthProvider.find(params[:id])
      end
  end
end
