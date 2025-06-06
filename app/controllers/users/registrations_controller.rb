# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController
    include DeviseCommon

    before_action :configure_sign_up_params, only: [:create]
    # before_action :configure_account_update_params, only: [:update]

    # GET /resource/edit
    def edit
      redirect_to register_info_account_path
    end

    # GET /resource/sign_up
    # def new
    #   super
    # end

    # POST /resource
    def create
      has_only_auth_providers_and_render_error || super
    end

    # PUT /resource
    # def update
    #   super
    # end

    # DELETE /resource
    # def destroy
    #   super
    # end

    def destroy
      resource.discard!
      Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
      set_flash_message :notice, :destroyed
      respond_with_navigational(resource) { render json: { redirect_path: root_path } }
    end

    # GET /resource/cancel
    # Forces the session data which is usually expired after sign
    # in to be expired now. This is useful if the user wants to
    # cancel oauth signing in/up in the middle of the process,
    # removing all OAuth session data.
    # def cancel
    #   super
    # end

    def render_options_for_create(_given_options)
      replace_flash_message_to_json
    end

    def render_options_for_update(_given_options)
      replace_flash_message_to_json
    end

    protected

      def replace_flash_message_to_json
        return if (text = flash.notice).blank?

        flash.delete(:notice)
        { json: { flash_message: { text:, type: 'success' } } }
      end

      # By default we want to require a password checks on update.
      # You can overwrite this method in your own RegistrationsController.
      def update_resource(resource, params)
        if (new_email = params[:email]).present?
          if new_email == resource.email
            resource.errors.add(:email, :same_as_current_value)
            return false
          elsif params.length == 1
            return resource.update_without_password(params)
          end
        end

        if params[:password].present? && params.length == 1 && resource.password_set_by_system? && resource.email_verified?
          resource.assign_attributes(**params, password_set_by_system: false)

          return resource.update_without_password({})
        end

        resource.update_with_password(params)
      end

      # If you have extra params to permit, append them to the sanitizer.
      def configure_sign_up_params
        devise_parameter_sanitizer.permit(:sign_up, keys: %i[theme_mode])
      end

      # If you have extra params to permit, append them to the sanitizer.
      # def configure_account_update_params
      #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
      # end

      # The path used after sign up.
      # def after_sign_up_path_for(resource)
      #   super
      # end

      # The path used after sign up for inactive accounts.
      def after_inactive_sign_up_path_for(_resource)
        root_path
      end
  end
end
