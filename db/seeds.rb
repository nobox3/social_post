ActionMailer::Base.perform_deliveries = false
SendgridService::Api.disable_api = true

# Seed 作成時間短縮のため画像の事前処理を無効化
FileAttachable::Image::Helper.preprocessed = false

load(Rails.root.join('db', 'seeds', "#{Rails.env.downcase}.rb"))

if Rails.env.development?
  puts 'Perform all enqueued jobs...'
  Sidekiq::Queue.all.reverse_each do |queues|
    queues.each do |queue|
      queue.klass.constantize.new.perform(*queue.args)
      queue.delete
    end
  end
end
