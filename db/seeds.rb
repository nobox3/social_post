require(Rails.root.join('db', 'seeds', 'seed_delete'))

ActionMailer::Base.perform_deliveries = false
SendgridService::Api.disable_api = true

# Seed 作成時間短縮のため画像の事前処理を無効化
FileAttachable::Image::Helper.preprocessed = false

puts 'Clear Sidekiq schedule set and queues...'
Sidekiq::ScheduledSet.new.clear
Sidekiq::RetrySet.new.clear
Sidekiq::DeadSet.new.clear
Sidekiq::Queue.all.each(&:clear) # rubocop:disable Rails/FindEach

if (users = User.all).any?
  puts '', '== Clear old users and its associated data...'
  SeedDelete.delete_users(users)
end

puts '', '== Create seed data...'
load(Rails.root.join('db', 'seeds', "#{Rails.env.downcase}.rb"))

puts 'Perform all enqueued jobs...'
Sidekiq::Queue.all.reverse_each do |queues|
  queues.each do |queue|
    queue.klass.constantize.new.perform(*queue.args)
    queue.delete
  end
end
