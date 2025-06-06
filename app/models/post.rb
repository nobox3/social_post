# frozen_string_literal: true

# == Schema Information
#
# Table name: posts
#
#  id         :bigint           not null, primary key
#  body       :text             default(""), not null
#  deleted_at :datetime
#  sent_at    :datetime
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#
# Indexes
#
#  index_posts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Post < ApplicationRecord
  include FileAttachable::Image
  include Discard::Model
  include ActsAsSluggable

  self.discard_column = :deleted_at

  has_many_attached_image(versions: %i[medium viewer])

  belongs_to :user

  # scopes
  scope :draft, -> { where(sent_at: nil) }
  scope :sent, -> { where.not(sent_at: nil) }
  scope :active, -> { kept.sent }
  scope :by_users, ->(scope) { joins(:user).merge(scope) }
  scope :feed, ->(current_user) {
    users = current_user.followings.enabled
    sub = 'followings'
    followings_post = "posts.user_id = #{sub}.id"

    joins("LEFT OUTER JOIN (#{users.to_sql}) AS #{sub} ON #{followings_post}")
      .where(user: current_user).or(where(followings_post))
  }

  # order
  scope :recent, -> { order('sent_at DESC NULLS LAST, id DESC') }
  scope :oldest, -> { order(:sent_at) }

  # includes
  scope :with_user, -> { includes(user: { avatar_attachment: [blob: :variant_records] }) }
  scope :with_relations, -> { with_user.with_attached_images }

  # validations
  validates :body, length: { maximum: DefaultValues::MAX_TEXTAREA_COUNT }
  validates :body, presence: true, if: :sent?, unless: -> { images.attached? }

  def mark_as_sent
    self.sent_at = Time.zone.now unless sent?
  end

  def sent?
    sent_at.present?
  end

  def save_and_send!
    mark_as_sent
    save!
  end
end
