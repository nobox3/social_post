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

fixture_path = Rails.root.join('spec', 'fixtures')

users = Array.new(1) do |i|
  num = i + 1

  user = User.create!(
    email: "user#{i == 0 ? '' : num}@example.com",
    username: "User#{num}",
    password: 'password',
    created_at: base_timestamp,
    updated_at: base_timestamp,
  )

  if i < 8
    user.avatar.attach(
      io: fixture_path.join('avatars', "avatar_#{num}.webp").open, filename: 'avatar.webp',
    )
  end

  user.update!(confirmed_at: base_timestamp)
  user
end

puts 'Create relationships...'
7.times do |i|
  other_user = users[i + 1]

  users[0].active_relationships.create(followed: other_user)
  other_user.active_relationships.create(followed: users[0])
end

puts 'Create posts...'
50.times do |i|
  num = i + 1
  timestamp = base_timestamp + (num * 3.minutes)

  post = users[0].posts.create!(
    body: Faker::Lorem.sentence(word_count: 10),
    created_at: timestamp,
    updated_at: timestamp,
  )

  if i >= 46
    post.images.attach(
      io: fixture_path.join('images', "image_#{num - 46}.webp").open,
      filename: 'image.webp',
    )
  end

  post.update!(sent_at: timestamp)
end

users[1..].each do |user|
  10.times do |i|
    num = i + 1
    timestamp = base_timestamp + (num * 3.minutes)

    post = user.posts.create!(
      body: Faker::Lorem.sentence(word_count: 10),
      created_at: timestamp,
      updated_at: timestamp,
    )

    post.update!(sent_at: timestamp)
  end
end
