# frozen_string_literal: true

class UserMailer < Devise::Mailer
  helper :application
  include Devise::Controllers::UrlHelpers

  # override Devise::Mailers::Helpers
  def template_paths
    default_template_path
  end

  def headers_for(action, opts)
    super.tap { |options| options[:to] = email_address_with_name_for_user }
  end

  def registration_done
    mail(subject: i18n_subject)
  end

  def account_suspend
    mail(subject: i18n_subject(user_name: @user.username))
  end

  def account_destroy
    mail(subject: i18n_subject(user_name: @user.username))
  end

  def translate(key, options = {})
    @action ||= options.delete(:action) || action_name

    t(key, scope: [:devise, :mailer, @action], **options)
  end

  private

    def i18n_subject(options = {})
      translate(:subject, options)
    end
end
