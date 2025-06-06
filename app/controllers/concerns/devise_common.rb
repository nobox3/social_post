# frozen_string_literal: true

module DeviseCommon
  extend ActiveSupport::Concern

  included do
    self.responder = DeviseUserResponder

    wrap_parameters :user
  end

  def find_resource_by_email
    User.find_for_database_authentication(email: resource_params[:email])
  end

  def render_error(i18_key, options = {})
    warden.custom_failure!

    self.status = options.delete(:status) || :unauthorized
    options[:scope] ||= translation_scope

    render json: error_message(i18_key, options)
  end

  def has_only_auth_providers_and_render_error
    user = find_resource_by_email

    if user&.password_set_by_system? && (auth_provider = user.auth_providers.recent.first)
      render_error(:auth_provider_exists, scope: 'devise.failure', provider: auth_provider.human_enum_name(:provider))
      true
    end
  end

  class DeviseUserResponder < Devise::Controllers::Responder
    # https://github.com/heartcombo/responders/blob/main/lib/action_controller/responder.rb
    def default_render
      options.merge!(render_options_for_action(options))
      super
    end

    # def display(resource, given_options = {})
    #   super(resource, given_options.merge(render_options_for_action(given_options)))
    # end

    def json_resource_errors
      { errors: resource.errors.full_messages }
    end

    private

      def render_options_for_action(given_options)
        render_options_for = :"render_options_for_#{controller.action_name}"

        controller.respond_to?(render_options_for) ? controller.public_send(render_options_for, given_options).to_h : {}
      end
  end
end
