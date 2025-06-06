# frozen_string_literal: true

module Api
  class RelationshipsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_relationship, only: %i[destroy]

    def create
      relationship = current_user.active_relationships.build(relationship_params)

      authorize(relationship)
      relationship.save!

      render json: { relationship_id: relationship.id, flash_message: flash_message(:followed) }
    end

    def destroy
      authorize(@relationship)
      @relationship.destroy!

      render json: { flash_message: flash_message(:unfollowed) }
    end

    private

      def set_relationship
        @relationship = Relationship.find(params[:id])
      end

      def relationship_params
        params.require(:relationship).permit(:followed_id)
      end
  end
end
