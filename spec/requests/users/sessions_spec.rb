require 'rails_helper'

RSpec.describe 'Users::Sessions', type: :request do
  describe 'POST /users/sign_in' do
    let(:user) { create(:user) }

    it 'signs in successfully with email' do
      params = { user: { email: user.email, password: 'password' } }

      post(user_session_path, params:)
      expect(response).to have_http_status(:redirect)
      expect(response).to redirect_to(feed_account_path)
      expect(flash.notice).to eq(I18n.t(:signed_in, scope: 'devise.sessions'))
    end

    context 'when user who has only auth providers try to sign in with email' do
      it 'failed sign in then suggest already registered with auth provider' do
        auth_provider = create_auth_provider_by_mock_auth(:google_oauth2)
        params = { user: { email: auth_provider.user.email } }

        post(user_session_path, params:)
        expect(response).to have_http_status(:unauthorized)
        expect(json_data[:errors]).to eq(
          I18n.t(:auth_provider_exists, scope: 'devise.failure', provider: auth_provider.human_enum_name(:provider)),
        )
      end
    end
  end
end
