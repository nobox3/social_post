Rails.application.configure do
  unless Rails.application.config.consider_all_requests_local
    config.exceptions_app = ->(env) {
      original_path = env['action_dispatch.original_path'].to_s

      if original_path.start_with?('/api')
        Api::ErrorsController.action(:show).call(env)
      elsif original_path.start_with?('/webhook')
        Webhook::ErrorsController.action(:show).call(env)
      else
        ErrorsController.action(:show).call(env)
      end
    }
  end
end
