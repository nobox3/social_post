require 'rails_helper'

RSpec.describe 'Users::Registrations', type: :request do
  describe 'POST /users' do
    it 'signs up successfully with email' do
      params = { user: { email: build(:user).email, password: 'password' } }

      post(user_registration_path, params:)
      expect(response).to have_http_status(:success)
      expect(json_data[:flash_message][:text]).to eq(I18n.t(:signed_up_but_unconfirmed, scope: 'devise.registrations'))
    end

    context 'when user who has only auth providers try to sign up with email' do
      it 'failed sign up then suggest already registered with auth provider' do
        auth_provider = create_auth_provider_by_mock_auth(:google_oauth2)
        params = { user: { email: auth_provider.user.email, password: 'password' } }

        post(user_registration_path, params:)
        expect(response).to have_http_status(:unauthorized)
        expect(json_data[:errors]).to eq(
          I18n.t(:auth_provider_exists, scope: 'devise.failure', provider: auth_provider.human_enum_name(:provider)),
        )
      end
    end
  end
end
