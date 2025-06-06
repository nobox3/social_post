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
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:username).on(:update).with_message(:blank) }
    it { is_expected.to validate_length_of(:username).is_at_most(DefaultValues::MAX_TEXT_COUNT).with_message(:too_long) }
    it { is_expected.to validate_email_format_of(:email).with_message(:invalid) }
    it { is_expected.to validate_presence_of(:password).with_message(:blank) }
    it { is_expected.to validate_length_of(:password).is_at_least(Devise.password_length.first).with_message(:too_short) }
    it { is_expected.to validate_length_of(:password).is_at_most(Devise.password_length.last).with_message(:too_long) }

    it 'valid password format' do
      expect(build(:user, password: 'Valid1234')).to be_valid
    end

    it 'invalid password format' do
      expect(build(:user, password: 'Invalid1234!')).not_to be_valid
    end
  end
end
