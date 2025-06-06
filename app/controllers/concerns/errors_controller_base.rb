# frozen_string_literal: true

module ErrorsControllerBase
  extend ActiveSupport::Concern

  included do
    rescue_from Exception, with: :internal_server_error
    rescue_from ActionController::RoutingError, with: :not_found
    rescue_from ActiveRecord::RecordNotFound, with: :not_found
  end

  def show
    raise
  end

  def render_error
    head status
  end

  def logger_info(e)
    logger.info "Rendering #{status} with exception: #{e.message}" if e
  end

  def not_found(e = nil)
    self.status = :not_found

    logger_info(e)
    render_error
  end

  def internal_server_error(e = nil)
    self.status = :internal_server_error

    logger_info(e)
    render_error
  end
end
