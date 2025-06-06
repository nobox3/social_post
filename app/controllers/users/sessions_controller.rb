# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    include DeviseCommon

    # before_action :configure_sign_in_params, only: [:create]

    # GET /resource/sign_in
    # def new
    #   super
    # end

    # POST /resource/sign_in
    def create
      has_only_auth_providers_and_render_error || super
    end

    # DELETE /resource/sign_out
    def destroy
      theme_mode = current_user.theme_mode

      super { store_user_theme_mode(theme_mode) }
    end

    protected

      # If you have extra params to permit, append them to the sanitizer.
      # def configure_sign_in_params
      #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
      # end

      def after_sign_in_path_for(resource)
        stored_location_for(resource) || feed_account_path
      end

      def respond_to_on_destroy
        render json: { redirect_path: after_sign_out_path_for(resource_name) }
      end
  end
end
