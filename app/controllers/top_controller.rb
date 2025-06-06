# frozen_string_literal: true

class TopController < ApplicationController
  before_action :user_authenticate?
  def top
    if user_signed_in?
      redirect_to feed_account_path
    else
      redirect_to new_user_session_path
    end
  end
end
