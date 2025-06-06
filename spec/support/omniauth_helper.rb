module OmniauthHelper
  def mock_auth
    OmniAuth.config.mock_auth
  end

  def add_mock_auth(provider)
    OmniAuth.config.add_mock(provider, create_mock_auth(provider))
  end

  def create_mock_auth(provider)
    provider = :google if provider.to_sym == :google_oauth2

    mock = Faker::Omniauth.public_send(provider)
    mock[:info][:image] = nil
    mock
  end

  def create_auth_provider_by_mock_auth(mock_auth_or_provider)
    mock = mock_auth_or_provider.is_a?(Symbol) ? add_mock_auth(mock_auth_or_provider) : mock_auth_or_provider
    auth_provider = build(:auth_provider, provider: mock[:provider], uid: mock[:uid])
    auth_provider.tap { |ap| ap.build_user_by_info(mock[:info]) }.save!
    auth_provider
  end
end
