# frozen_string_literal: true

# == Schema Information
#
# Table name: relationships
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  followed_id :bigint
#  follower_id :bigint
#
# Indexes
#
#  index_relationships_on_followed_id                  (followed_id)
#  index_relationships_on_follower_id                  (follower_id)
#  index_relationships_on_follower_id_and_followed_id  (follower_id,followed_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (followed_id => users.id)
#  fk_rails_...  (follower_id => users.id)
#
class Relationship < ApplicationRecord
  belongs_to :follower, class_name: 'User'
  belongs_to :followed, class_name: 'User'

  validate -> { errors.add(:base, :same_user) if follower == followed }, on: :create

  after_create :increment_followers_count
  after_destroy :decrement_followers_count

  private

    def increment_followers_count
      followed.increment!(:followers_count, touch: true)
      follower.increment!(:followings_count, touch: true)
    end

    def decrement_followers_count
      followed.decrement!(:followers_count, touch: true)
      follower.decrement!(:followings_count, touch: true)
    end
end
