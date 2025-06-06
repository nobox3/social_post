# frozen_string_literal: true

class PostPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      return scope.all if admin?

      scope.kept
    end
  end

  # api controller only
  def create?
    owner?
  end

  def update?
    owner?
  end

  def attach_file?
    owner?
  end

  def delete_attachment?
    owner?
  end

  def destroy?
    owner?
  end
end
