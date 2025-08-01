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
    let!(:google_auth) { add_mock_auth(:google_oauth2) }
    let!(:auth_info) { google_auth[:info] }
    let(:auth_provider) { build(:auth_provider, google_auth.slice(:provider, :uid)) }
    let(:user) { auth_provider.build_user_by_info(auth_info) }

    it 'builds user by info' do
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

      expect(user).to be_valid
      expect(user.email).to be_present
      expect(user.email_verified).to be false
    end

    it 'builds user by info without name' do
      auth_info[:name] = nil

      expect(user).to be_valid
      expect(user.username).to start_with('user-')
    end

    context 'builds user by info with image' do
      let(:auth_provider) do
        auth_provider = build(:auth_provider, google_auth.slice(:provider, :uid))

        allow(auth_provider).to receive(:build_user_by_info).and_wrap_original do |m, info|
          url = info.delete(:image)
          user = m.call(info)

          user.avatar.attach(io: File.open(url), filename: "avatar#{File.extname(url)}")
          user
        end

        auth_provider
      end

      it 'attaches avatar successfully' do
        auth_info[:image] = file_fixture('avatars/avatar_1.webp').to_s
        auth_provider.tap { |ap| ap.build_user_by_info(auth_info) }.save_with_user

        expect(auth_provider.user.avatar).to be_attached
      end

      it 'does not attach avatar with invalid image' do
        auth_info[:image] = file_fixture('images/unsupported_image_type.heic').to_s
        auth_provider.tap { |ap| ap.build_user_by_info(auth_info) }.save_with_user

        expect(auth_provider.user.avatar).not_to be_attached
      end
    end
  end
end
