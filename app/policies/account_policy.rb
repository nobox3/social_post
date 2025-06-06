# frozen_string_literal: true

class AccountPolicy
  attr_reader :user

  def initialize(user, _record)
    raise Pundit::NotAuthorizedError, I18n.t('pundit.default') unless user

    @user = user
  end

  # api controller only
  def update?
    true
  end

  def update_theme_mode?
    true
  end

  # both controllers
  def feed?
    true
  end

  def posts?
    true
  end

  def followings?
    true
  end

  def followers?
    true
  end

  def profile?
    true
  end

  def register_info?
    true
  end

  def app_settings?
    true
  end
end
