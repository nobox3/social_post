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

  def build_user_by_info(info)
    build_user(password: generate_alphanumeric, password_set_by_system: true, confirmed_at: Time.zone.now) do |user|
      if info.present?
        user.email = info[:email]
        user.username = info[:name]
        user.attach_avatar_from_url(info[:image]) if info[:image].present?
      end

      user.assign_unique_alphanumeric(:slug)
      user.email_verified = user.email.present?
      user.email = user.email.presence || "user@#{user.slug}.com"
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
