require 'rails_helper'

RSpec.describe 'Api::Accounts', type: :request do
  before { sign_in user }

  describe 'PUT /api/account' do
    let!(:user) { create(:user, username: 'a') }
    let(:api_path) { api_account_path(user.id) }

    it 'update successfully with valid params' do
      expect { put api_path, params: { user: { username: 'b' } } }.not_to change { User.count }
      expect(user.username).to eq('b')
      expect(response).to have_http_status(:success)
    end

    it 'failure to update with invalid params' do
      expect { put api_path, params: { user: { username: '' } } }.not_to change { User.count }
      expect(user.reload.username).to eq('a')
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_data).to include(:errors)
    end

    it 'attach avatar successfully' do
      avatar = fixture_file_upload(file_fixture('avatars/avatar_1.webp'), 'image/webp')

      expect { put api_path, params: { user: { avatar: } } }.not_to change { User.count }
      expect(user.reload.avatar.attached?).to be(true)
      expect(response).to have_http_status(:success)
      expect(json_data[:user][:avatar_url]).to eq(user.avatar_url)
    end
  end
end
