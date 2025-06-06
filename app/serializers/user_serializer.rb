# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  admin                  :boolean          default(FALSE), not null
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :string
#  deleted_at             :datetime
#  email                  :string           default(""), not null
#  email_verified         :boolean          default(FALSE), not null
#  encrypted_password     :string           default(""), not null
#  failed_attempts        :integer          default(0), not null
#  followers_count        :integer          default(0), not null
#  followings_count       :integer          default(0), not null
#  language               :string           not null
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :string
#  locked_at              :datetime
#  password_set_by_system :boolean          default(FALSE), not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  sign_in_count          :integer          default(0), not null
#  slug                   :string           not null
#  suspended              :boolean          default(FALSE), not null
#  theme_mode             :integer          default("device"), not null
#  unconfirmed_email      :string
#  unlock_token           :string
#  username               :string           not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_slug                  (slug) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#
class UserSerializer < ApplicationSerializer
  attributes :id, :username, :slug, :followers_count, :followings_count

  attributes :avatar_url

  attribute :relationship_id, if: proc { |obj| obj.respond_to?(:relationship_id) }, &:relationship_id

  attribute :url do |obj|
    user_path(obj)
  end

  class << self
    def serialize_user_for_show(user, current_user)
      serialized = serialize(user)

      if (relationship = user.passive_relationships.find_by(follower: current_user))
        serialized[:relationship_id] = relationship.id
      end

      serialized
    end

    def serialize_followings(user, current_user: nil, params: {})
      serialize_users(user.followings, params) do |users|
        if current_user
          users.with_relationship_id(current_user.active_relationships)
        else
          users.select_relationship_id
        end
      end
    end

    def serialize_followers(user, current_user: user, params: {})
      serialize_users(user.followers, params) do |users|
        users.with_relationship_id(current_user.active_relationships)
      end
    end

    private

      def serialize_users(users, params = {}, &)
        pagination = users.enabled.paginate(outset: params[:outset])

        return { users: [], total_users_count: 0 } if pagination.empty?

        users = pagination.records
        users = yield(users) if block_given?

        { users: serialize_collection(users.with_attached_avatar), total_users_count: pagination.count }
      end
  end
end
