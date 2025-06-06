# frozen_string_literal: true

# called from config/initializers/exceptions_app.rb
class ErrorsController < ApplicationController
  include ErrorsControllerBase

  layout 'application'

  def render_error
    respond_to do |format|
      format.html { @props = { status: } and render '/common' }
      format.json { head status }
    end
  end
end
