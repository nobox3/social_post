# frozen_string_literal: true

class RelationshipPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def create?
    follower?
  end

  def destroy?
    follower?
  end

  private

    def follower?
      user == record.follower
    end
end
