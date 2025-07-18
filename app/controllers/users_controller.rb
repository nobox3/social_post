# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: %i[show posts followings followers]
  before_action :set_user_to_props, only: %i[show posts followings followers]
  before_action :set_page_component_path, only: %i[posts followings followers]

  def show
    @props.merge!(PostSerializer.serialize_posts(@user.posts))
  end

  def posts
    @props.merge!(PostSerializer.serialize_posts(@user.posts))
  end

  def followings
    @props.merge!(UserSerializer.serialize_followings(@user, current_user:))
  end

  def followers
    @props.merge!(UserSerializer.serialize_followers(@user, current_user:))
  end

  private

    def set_user_to_props
      authorize(@user)
      decorate(@user)

      @props = { user: UserSerializer.serialize_user_for_show(@user, current_user) }
    end

    def set_page_component_path
      @props[:page_component_path] = '/users/show'
    end

    def set_user
      @user = policy_scope(User).find_by!(slug: params[:id])
    end
end
