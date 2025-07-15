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

fixture_path = Rails.root.join('spec', 'fixtures')
post_contents = YAML.parse_file(Rails.root.join('db', 'seeds', 'post_contents.yml')).to_ruby.deep_symbolize_keys

puts 'Create users...'
users = Array.new(post_contents[:users].size) do |i|
  num = i + 1

  user = User.create!(
    email: "user#{i == 0 ? '' : num}@example.com",
    username: "User#{num}",
    password: 'password',
    created_at: base_timestamp,
    updated_at: base_timestamp,
  )

  if i < 8
    path = fixture_path.join('avatars', "avatar_#{num}.webp")

    user.avatar.attach(io: path.open, filename: "avatar#{File.extname(path)}")
  end

  user.update!(confirmed_at: base_timestamp)
  user
end

puts 'Create relationships...'
(users.size - 1).times do |i|
  other_user = users[i + 1]

  users[0].active_relationships.create(followed: other_user)
  other_user.active_relationships.create(followed: users[0])
end

puts 'Create posts...'
users.each_with_index do |user, i|
  if i < post_contents[:users].size
    contents = post_contents[:users][i][:posts]
  else
    contents = Array.new(10).map { |_| { body: Faker::Lorem.sentence(word_count: 10) } }
  end

  contents.each_with_index do |content, j|
    num = j + 1
    timestamp = base_timestamp + (num * rand(10..20).minutes)
    timestamp += 2.hours if content[:images].present?
    post = user.posts.create!(body: content[:body], created_at: timestamp, updated_at: timestamp)

    content[:images]&.each do |image|
      path = fixture_path.join('images', image)

      post.images.attach(io: path.open, filename: "image#{File.extname(path)}")
    end

    post.update!(sent_at: timestamp)
  end
end
