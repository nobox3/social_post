# frozen_string_literal: true

module Api
  class PostsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_post, only: %i[update destroy attach_file delete_attachment]

    def create
      @post = Post.new(post_params.merge(user: current_user))

      authorize(@post)
      send_or_save_post!

      render json: serialize_post
    end

    def update
      authorize(@post)
      @post.assign_attributes(post_params)
      send_or_save_post!

      render json: serialize_post
    end

    def destroy
      authorize(@post)
      @post.discard!

      render json: { flash_message: flash_message_for_action(Post) }
    end

    def attach_file
      authorize(@post)

      @post.with_lock do
        @post.images.attach(params[:file])
      end

      render json: { attachment: ImageUrlHelper.serialize_image(@post.images.last, :medium) }
    end

    def delete_attachment
      authorize(@post)
      @post.images.find(params[:attachment_id]).destroy!

      render json: {}
    end

    private

      def serialize_post
        { post: PostSerializer.serialize_post(@post) }
      end

      def send_or_save_post!
        params[:send] ? @post.save_and_send! : @post.save!
      end

      def set_post
        @post = Post.find(params[:id])
      end

      def post_params
        params.require(:post).permit(:body)
      end
  end
end
