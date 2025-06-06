class SeedDelete
  class << self
    def delete_users(users)
      return if users.empty?

      puts 'Delete users...'

      users.each do |obj|
        delete_posts(obj.posts)
        obj.avatar&.purge
      end

      users.destroy_all
    end

    def delete_posts(posts)
      return if posts.empty?

      puts 'Delete posts...'

      posts.each do |obj|
        obj.images.purge
      end

      posts.destroy_all
    end
  end
end
