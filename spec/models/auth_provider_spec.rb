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
require 'rails_helper'

RSpec.describe AuthProvider, type: :model do
  context 'build_user_by_info' do
    let!(:auth_info) { create_mock_auth(:google)[:info] }
    let!(:auth_provider) { build(:auth_provider) }

    it 'builds user by info' do
      user = auth_provider.build_user_by_info(auth_info)

      expect(user).to be_valid
      expect(user.email).to eq(auth_info[:email])
      expect(user.username).to eq(auth_info[:name])
      expect(user.avatar).not_to be_attached
      expect(user.email_verified).to be true
      expect(user.password_set_by_system).to be true
      expect(user.confirmed_at).to be_present
    end

    it 'builds user by info without email' do
      auth_info[:email] = nil
      user = auth_provider.build_user_by_info(auth_info)

      expect(user).to be_valid
      expect(user.email).to be_present
      expect(user.email_verified).to be false
    end

    it 'builds user by info without name' do
      auth_info[:name] = nil
      user = auth_provider.build_user_by_info(auth_info)

      expect(user).to be_valid
      expect(user.username).to start_with('user-')
    end

    it 'builds user by info with image' do
      auth_info[:image] = file_fixture('avatars/avatar_1.webp').to_s
      user = User.new

      allow(user).to receive(:attach_avatar_from_url).with(auth_info[:image]) do |url|
        user.avatar.attach(io: File.open(url), filename: 'image.webp')
      end

      allow(auth_provider).to receive(:build_user_by_info).with(auth_info) do |info|
        user.tap { |u| u.attach_avatar_from_url(info[:image]) }
      end

      expect(auth_provider.build_user_by_info(auth_info).avatar).to be_attached
    end
  end
end
