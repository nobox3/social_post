# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include ModelHelper

  primary_abstract_class

  protected

    def abort_with_error(attribute, type = :invalid, options = {})
      errors.add(attribute, type, **options)
      throw :abort
    end
end
