# frozen_string_literal: true

class ApplicationDecorator
  attr_reader :resource

  def initialize(resource)
    @resource = resource
  end

  def meta
    nil
  end

  def i18n_params_for_path
    nil
  end
end
