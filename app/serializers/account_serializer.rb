# frozen_string_literal: true

class AccountSerializer < ApplicationSerializer
  set_type :user

  attributes :id, :username, :email, :admin, :password_set_by_system, :followers_count, :followings_count

  attributes :avatar_url
  attribute :email, if: proc { |obj| obj.email_verified? }

  attribute :avatar_url_large do |obj|
    obj.avatar_url(:large)
  end

  HEADER_FIELDS = %i[id username avatar_url followers_count followings_count].freeze

  class << self
    def serialize_current_user(current_user, options = {})
      options[:fields] ||= {}
      # options[:params] ||= {}

      options[:fields][:user] = options[:fields][:user].to_a | HEADER_FIELDS
      # options[:params][:current_user] = current_user

      serialize(current_user, options)
    end

    def serialize_register_info(current_user)
      serialized = serialize(current_user, fields: { user: %i[email password_set_by_system] })
      serialized[:auth_providers] = current_user.auth_providers.map { |ap| ap.slice(:id, :provider) }
      serialized
    end
  end
end
