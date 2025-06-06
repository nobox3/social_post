# frozen_string_literal: true

class UserDecorator < ApplicationDecorator
  def meta
    @meta ||= { image: resource.avatar_public_url }
  end

  def i18n_params_for_path
    { removed_segments: resource.slug, interpolation: { user_name: resource.username } }
  end
end
