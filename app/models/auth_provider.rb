# frozen_string_literal: true

# == Schema Information
#
# Table name: auth_providers
#
#  id         :bigint           not null, primary key
#  provider   :integer          not null
#  uid        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#
# Indexes
#
#  index_auth_providers_on_provider_and_uid_and_user_id  (provider,uid,user_id) UNIQUE
#  index_auth_providers_on_user_id                       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class AuthProvider < ApplicationRecord
  belongs_to :user

  enum :provider, { google_oauth2: 0 }

  scope :recent, -> { order(created_at: :desc) }

  before_destroy :abort_with_no_other_authentication_methods, prepend: true, unless: :has_other_authentication_methods?

  def build_user_by_info(info, attributes = {})
    build_user(
      password: generate_alphanumeric, password_set_by_system: true, confirmed_at: Time.zone.now, **attributes,
    ) do |u|
      if info.present?
        u.email = info[:email]
        u.username = info[:name]
      end

      u.assign_unique_alphanumeric(:slug)
      u.email_verified = u.email.present?
      u.email = u.email.presence || "user@#{u.slug}.com"

      u.auth_providers << self
    end
  end

  private

    def has_other_authentication_methods?
      !user.password_set_by_system? || user.auth_providers.where.not(id:).exists?
    end

    def abort_with_no_other_authentication_methods
      abort_with_error(:base, :has_no_other_authentication_methods)
    end
end
