# frozen_string_literal: true

class AdminPolicy
  attr_reader :user

  def initialize(user, _record)
    raise Pundit::NotAuthorizedError, I18n.t('pundit.default') unless user&.admin?

    @user = user
  end

  def index?
    true
  end

  def show?
    true
  end

  def create?
    true
  end

  def new?
    true
  end

  def update?
    true
  end

  def edit?
    true
  end

  def destroy?
    true
  end
end
