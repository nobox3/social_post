# frozen_string_literal: true

module DefaultValues
  MAX_TEXT_COUNT = 200
  MAX_TEXTAREA_COUNT = 2000
  VALID_PASSWORD_REGEX = /\A[a-zA-Z0-9]+\z/
  MAX_SLUG_LENGTH = 30
  VALID_SLUG_REGEX = /\A[a-z0-9_-]+\z/

  ACCEPTED_IMAGE_TYPES = ['image/webp', 'image/png', 'image/jpeg', 'image/gif'].freeze
  MAX_IMAGE_FILE_SIZE = 30.megabytes
  MAX_IMAGE_DIMENSION_SIZE = 7680..7680
  MAX_IMAGES_COUNT = 3

  META_MAX_TITLE_LENGTH = 60
  META_MAX_DESCRIPTION_LENGTH = 160

  SITE_NAME = 'Social Post'
  PERMITTED_SEARCH_PARAMS = %w[page s k].freeze
  LOCALE_LONG = { ja: 'ja-JP', en: 'en-US' }.freeze
end
