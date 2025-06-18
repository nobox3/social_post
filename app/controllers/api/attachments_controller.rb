# frozen_string_literal: true

module Api
  class AttachmentsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_attachment, only: %i[viewer_image]

    def viewer_image
      authorize(@attachment, policy_class: AttachmentPolicy)

      render json: { url: ImageUrlHelper.url(@attachment, :viewer) }
    end

    private

      def set_attachment
        @attachment = ActiveStorage::Attachment.find(params[:id])
      end
  end
end
