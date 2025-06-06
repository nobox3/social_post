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
class PostSerializer < ApplicationSerializer
  attributes :id, :body

  belongs_to :user

  attribute :images, &:serialize_images

  attribute :sent_at, if: proc { |obj| obj.sent? } do |obj|
    sent_at = obj.sent_at

    format_datetime(sent_at, 1.hour.ago < sent_at ? :time_ago_in_words : :short)
  end

  class << self
    def serialize_post(post)
      serialize(post, include: %i[user])
    end

    def serialize_posts(posts, params = {})
      pagination = posts.active.paginate(outset: params[:outset])

      return { posts: [], total_posts_count: 0 } if pagination.empty?

      posts = serialize_collection(pagination.records.recent.with_relations, include: %i[user])

      { posts:, total_posts_count: pagination.count }
    end

    def serialize_feed(current_user, params = {})
      serialized = serialize_posts(Post.feed(current_user), params)
      serialized[:draft_post] = serialize_post(current_user.posts.draft.first) if params[:outset].blank?
      serialized
    end
  end
end
