# frozen_string_literal: true

module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    include DeviseCommon

    skip_before_action :verify_authenticity_token, only: User.omniauth_providers.map(&:to_sym)

    User.omniauth_providers.each do |provider|
      define_method(provider) { callback_for_provider }
    end

    def devise_i18n_options(options)
      options.merge(kind: AuthProvider.human_enum_name(:provider, strategy_name))
    end

    def failure
      set_flash_message!(:alert, :failure, reason: failure_message)
      redirect_to after_omniauth_failure_path_for(resource_name)
    end

    # protected

    # The path used when OmniAuth fails
    # def after_omniauth_failure_path_for(scope)
    #   super
    # end

    private

      def strategy_name
        action_name == 'failure' ? failed_strategy.name : action_name
      end

      def callback_for_provider
        omniauth_auth = request.env['omniauth.auth']
        @auth_provider = AuthProvider.find_or_initialize_by(omniauth_auth.slice(:provider, :uid).to_h)

        if @auth_provider.persisted?
          redirect_with_sign_in
          return
        end

        if user_signed_in?
          current_user.auth_providers << @auth_provider
          redirect_with_sign_in
          return
        end

        info = omniauth_auth.info

        if (email = info&.email).present? && User.exists?(email:)
          redirect_with_error(:email_exists)
          return
        end

        if request.env['omniauth.params']['is_registration'] == 'true'
          @auth_provider.tap { |ap| ap.build_user_by_info(info) }.save!
          redirect_with_sign_in
        else
          redirect_with_error(:not_registered)
        end
      end

      def redirect_with_sign_in
        sign_in(@auth_provider.user, event: :authentication)
        set_flash_message!(:notice, :success)
        redirect_to after_sign_in_path_for(@auth_provider.user)
      end

      def redirect_with_error(i18n_key)
        set_flash_message!(:alert, i18n_key)
        redirect_to new_user_registration_url
      end

      def after_sign_in_path_for(resource)
        stored_location_for(resource) || feed_account_url
      end
  end
end
