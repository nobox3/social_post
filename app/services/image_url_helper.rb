# frozen_string_literal: true

class ImageUrlHelper
  class << self
    include Rails.application.routes.url_helpers

    def serialize_images(images, key)
      images.map { |image| serialize_image(image, key) }
    end

    def serialize_image(image, key)
      { **image.slice(:id, :filename, :byte_size, :content_type), url: url(image, key) }
    end

    def url(image, key)
      cdn_proxy_url(process_with_key(image, key))
    rescue StandardError => e
      Rails.logger.warn(e.message)
      nil
    end

    def public_url(image, key)
      rails_storage_proxy_url(process_with_key(image, key))
    end

    def attach_from_url(image, url)
      URI.parse(url).open do |io|
        if (type = io.content_type).start_with?('image/')
          image.attach(io:, filename: type.tr('/', '.'))
        end
      end
    rescue StandardError => e
      Rails.logger.warn(e.message)
      nil
    end

    private

      def process_with_key(image, key)
        image.representation(key).processed
      end
  end
end
