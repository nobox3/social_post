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
require 'rails_helper'

RSpec.describe Post, type: :model do
  describe 'validations' do
    it { is_expected.to validate_length_of(:body).is_at_most(DefaultValues::MAX_TEXTAREA_COUNT).with_message(:too_long) }
  end
end
