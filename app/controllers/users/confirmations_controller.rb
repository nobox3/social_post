# frozen_string_literal: true

module Users
  class ConfirmationsController < Devise::ConfirmationsController
    include DeviseCommon

    before_action :user_authenticate?, only: %i[new] # rubocop:disable Rails/LexicallyScopedActionFilter

    # GET /resource/confirmation/new
    # def new
    #   super
    # end

    # POST /resource/confirmation
    # def create
    #   super
    # end

    # GET /resource/confirmation?confirmation_token=abcdef
    # def show
    #   super
    # end

    protected

      # The path used after resending confirmation instructions.
      # def after_resending_confirmation_instructions_path_for(resource_name)
      #   super(resource_name)
      # end

      # The path used after confirmation.
      def after_confirmation_path_for(_resource_name, resource)
        sign_in(resource)
        profile_account_path
      end
  end
end
