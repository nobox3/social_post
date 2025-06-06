# frozen_string_literal: true

module Api
  class AccountsController < ApplicationController
    wrap_parameters :user

    before_action :authenticate_user!
    before_action { authorize :account }

    def feed
      render json: PostSerializer.serialize_feed(current_user, params)
    end

    def posts
      render json: PostSerializer.serialize_posts(current_user.posts, params)
    end

    def followings
      render json: UserSerializer.serialize_followings(current_user, params:)
    end

    def followers
      render json: UserSerializer.serialize_followers(current_user, params:)
    end

    def profile
      render json: { profile_info: { avatar_url_large: current_user.avatar_url(:large) } }
    end

    def register_info
      render json: { register_info: AccountSerializer.serialize_register_info(current_user) }
    end

    def app_settings
      render json: {}
    end

    def update
      current_user.update!(user_params)

      render json: {
        user: { avatar_url: current_user.avatar_url },
        flash_message: flash_message(:profile_updated),
      }
    end

    private

      def user_params
        params.require(:user).permit(:username, :avatar)
      end
  end
end
