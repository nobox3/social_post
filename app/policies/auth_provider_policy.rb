# frozen_string_literal: true

class AuthProviderPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def destroy?
    owner?
  end
end
