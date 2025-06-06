# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  BASE_TEMPLATE_PATH = 'mailer_templates'

  before_action -> { @user = params[:user] }, if: -> { params[:user].present? }

  layout "#{BASE_TEMPLATE_PATH}/layouts/mailer"

  default to: -> { email_address_with_name_for_user }, template_path: -> { default_template_path }

  def default_template_path
    "#{BASE_TEMPLATE_PATH}/#{self.class.name.underscore}"
  end

  def email_address_with_name_for_user
    email_address_with_name(@user.email, @user.username)
  end
end
