# frozen_string_literal: true

class AccountsController < ApplicationController
  wrap_parameters :user

  before_action :authenticate_user!
  before_action { authorize :account }
  before_action :set_page_component_path, only: %i[feed posts followings followers profile register_info app_settings]

  def feed
    @props.merge!(PostSerializer.serialize_feed(current_user))
  end

  def posts
    @props.merge!(PostSerializer.serialize_posts(current_user.posts))
  end

  def followings
    @props.merge!(UserSerializer.serialize_followings(current_user))
  end

  def followers
    @props.merge!(UserSerializer.serialize_followers(current_user))
  end

  def profile
    @props[:profile_info] = { avatar_url_large: current_user.avatar_url(:large) }
  end

  def register_info
    @props[:register_info] = AccountSerializer.serialize_register_info(current_user)
  end

  def app_settings
  end

  private

    def set_page_component_path
      @props = { page_component_path: 'accounts/index' }
    end
end
