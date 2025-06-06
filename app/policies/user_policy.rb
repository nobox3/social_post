# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      return scope.all if admin?

      scope.enabled
    end
  end

  def show?
    true
  end

  # both controllers
  def posts?
    true
  end

  def followings?
    true
  end

  def followers?
    true
  end
end
