# frozen_string_literal: true

class AttachmentPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def viewer_image?
    true
  end
end
