# frozen_string_literal: true

class ApplicationPolicy
  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end

    def admin?
      user.admin
    end
  end

  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def error_message(query)
    I18n.t("#{self.class.to_s.underscore}.#{query}", scope: :pundit, default: :default)
  end

  protected

    def admin?
      user&.admin?
    end

    def owner?
      record.user == user
    end
end
