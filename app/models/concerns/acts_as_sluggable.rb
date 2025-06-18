# frozen_string_literal: true

module ActsAsSluggable
  extend ActiveSupport::Concern

  included do
    validates :slug, presence: true,
                     length: { maximum: DefaultValues::MAX_SLUG_LENGTH },
                     format: { with: DefaultValues::VALID_SLUG_REGEX, message: :invalid_slug }
    validates :slug, uniqueness: true, on: :update

    before_validation -> { assign_unique_alphanumeric(:slug) }, if: -> { slug.blank? }, on: :create
  end

  # Returns the slug to be used in URL parameters. This method overrides ActiveRecord::Base#to_param.
  def to_param
    slug
  end
end
