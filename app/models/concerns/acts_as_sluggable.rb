# frozen_string_literal: true

module ActsAsSluggable
  extend ActiveSupport::Concern

  included do
    before_validation -> { assign_unique_alphanumeric(:slug) }, if: -> { slug.blank? }, on: :create
  end

  # Returns the slug to be used in URL parameters. This method overrides ActiveRecord::Base#to_param.
  def to_param
    slug
  end
end
