# Check mailer and API are disabled
errors = []
errors << 'ActionMailer::Base' if ActionMailer::Base.perform_deliveries
errors << 'SendgridService::Api' unless SendgridService::Api.api_disabled?

if errors.any?
  abort "Aborted to create seeds. Mailer or API are enabled, please disable it: #{errors.join(', ')}"
end

base_timestamp = 3.days.ago

puts 'Create admin...'
admin = User.create!(
  admin: true,
  email: 'admin@example.com',
  username: 'Admin',
  password: 'password',
  created_at: base_timestamp,
  updated_at: base_timestamp,
)

admin.update!(confirmed_at: base_timestamp)

puts 'Create users...'

# fixture_path = Rails.root.join('spec', 'fixtures')

users = Array.new(1) do |i|
  num = i + 1

  user = User.create!(
    email: "user#{i == 0 ? '' : num}@example.com",
    username: "User#{num}",
    password: 'password',
    created_at: base_timestamp,
    updated_at: base_timestamp,
  )

  # if i < 8
  #   user.avatar.attach(
  #     io: fixture_path.join('avatars', "avatar_#{num}.webp").open, filename: 'avatar.webp',
  #   )
  # end

  user.update!(confirmed_at: base_timestamp)
  user
end
