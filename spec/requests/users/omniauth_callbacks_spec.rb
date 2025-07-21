require 'rails_helper'

RSpec.describe 'Users::OmniauthCallbacks', type: :request do
  before do
    env_config['devise.mapping'] = Devise.mappings[:user]
    env_config['omniauth.auth'] = auth
  end

  after do
    env_config['omniauth.auth'] = nil
    env_config['omniauth.params'] = nil
  end

  let(:i18n_options) do
    { scope: 'devise.omniauth_callbacks', kind: AuthProvider.human_enum_name(:provider, auth[:provider]) }
  end

  let(:after_sign_in_path) { feed_account_path }

  describe 'google_oauth2' do
    let!(:auth) { add_mock_auth(:google_oauth2) }

    let(:redirect_back_from_provider) do
      post(user_google_oauth2_omniauth_authorize_path)
      post(response.location)
    end

    describe 'Registration or Sign in (that not depend on is_registration param)' do
      let(:user) { create(:user) }

      it 'auth provider user signs in successfully' do
        create_auth_provider_by_mock_auth(auth)

        expect { redirect_back_from_provider }.to not_change { AuthProvider.count }.and not_change { User.count }
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(after_sign_in_path)
        expect(flash.notice).to eq(I18n.t(:success, **i18n_options))
      end

      it 'signed in user creates a new auth provider successfully' do
        sign_in(user)

        expect { redirect_back_from_provider }.to change { AuthProvider.count }.by(1).and not_change { User.count }
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(after_sign_in_path)
        expect(flash.notice).to eq(I18n.t(:success, **i18n_options))
      end

      it 'failure with email exists by email account user' do
        auth[:info][:email] = user.email

        expect { redirect_back_from_provider }.to not_change { AuthProvider.count }.and not_change { User.count }
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_registration_path)
        expect(flash.alert).to eq(I18n.t(:email_exists, **i18n_options))
      end
    end

    describe 'Registration' do
      before { env_config['omniauth.params'] = { 'is_registration' => 'true' } }

      it 'signs up successfully' do
        expect { redirect_back_from_provider }.to change { AuthProvider.count }.by(1).and change { User.count }.by(1)
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(after_sign_in_path)
        expect(flash.notice).to eq(I18n.t(:success, **i18n_options))
      end
    end

    describe 'Sign in' do
      before { env_config['omniauth.params'] = { 'is_registration' => 'false' } }

      it 'failed to sign in by not registered user' do
        expect { redirect_back_from_provider }.to not_change { AuthProvider.count }.and not_change { User.count }
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_registration_path)
        expect(flash.alert).to eq(I18n.t(:not_registered, **i18n_options))
      end
    end

    describe 'Failure' do
      it 'response failure by auth provider' do
        mock_auth[:google_oauth2] = :invalid_credentials

        expect { redirect_back_from_provider }.to not_change { AuthProvider.count }.and not_change { User.count }
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
        expect(flash.alert).to eq(I18n.t(:failure, **i18n_options, reason: mock_auth[:google_oauth2].to_s.humanize))
      end
    end
  end
end
