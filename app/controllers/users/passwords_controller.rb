# frozen_string_literal: true

module Users
  class PasswordsController < Devise::PasswordsController
    include DeviseCommon

    # GET /resource/password/new
    # def new
    #   super
    # end

    # POST /resource/password
    def create
      if find_resource_by_email.confirmed?
        super
      else
        render_error(:unconfirmed, scope: 'devise.failure')
      end
    end

    # GET /resource/password/edit?reset_password_token=abcdef
    # def edit
    #   super
    # end

    # PUT /resource/password
    def update
      super do |resource|
        if resource.errors.empty? && resource.password_set_by_system?
          resource.update_column(:password_set_by_system, false)
        end
      end
    end

    # protected

    # def after_resetting_password_path_for(resource)
    #   super(resource)
    # end

    # The path used after sending reset password instructions
    # def after_sending_reset_password_instructions_path_for(resource_name)
    #   super(resource_name)
    # end
  end
end
