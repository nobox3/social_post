# frozen_string_literal: true

module Api
  class UsersController < ApplicationController
    before_action :authenticate_user!
    before_action :set_user, only: %i[posts followings followers]

    def posts
      authorize(@user)

      render json: PostSerializer.serialize_posts(@user.posts, params)
    end

    def followings
      authorize(@user)

      render json: UserSerializer.serialize_followings(@user, current_user:, params:)
    end

    def followers
      authorize(@user)

      render json: UserSerializer.serialize_followers(@user, current_user:, params:)
    end

    private

      def set_user
        @user = policy_scope(User).find(params[:id])
      end
  end
end
