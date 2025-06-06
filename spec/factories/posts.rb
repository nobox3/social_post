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
FactoryBot.define do
  factory :post do
    body { Faker::Lorem.sentence }
    sent_at { Time.zone.now }
    user

    trait :draft do
      body { '' }
      sent_at { nil }
    end
  end
end
