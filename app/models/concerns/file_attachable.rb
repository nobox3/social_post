# frozen_string_literal: true

module FileAttachable
  module Image
    extend ActiveSupport::Concern

    class_methods do
      def has_one_attached_image(options = {})
        has_one_or_many_attached_image(false, options)
      end

      def has_many_attached_image(options = {})
        has_one_or_many_attached_image(true, options)
      end

      def has_one_or_many_attached_image(is_has_many, options = {})
        options[:default_version_key] ||= :medium
        block = Helper.block_for_attached(options)
        default_version_key = options[:default_version_key]
        options[:validates] ||= {}

        if is_has_many
          name = options[:name] || :images
          has_many_attached(name, &block)

          define_method(:"serialize_#{name}") do |key = default_version_key|
            ImageUrlHelper.serialize_images(public_send(name), key)
          end

          options[:validates][:limit] ||= { max: DefaultValues::MAX_IMAGES_COUNT }
          options[:validates][:if] ||= -> { public_send(name).attached? }
        else
          name = options[:name] || :image
          has_one_attached(name, &block)

          define_method(:"serialize_#{name}") do |key = default_version_key|
            ImageUrlHelper.serialize_image(public_send(name), key)
          end

          define_method(:"#{name}_url") do |key = default_version_key|
            ImageUrlHelper.url(public_send(name), key)
          end

          define_method(:"#{name}_public_url") do |key = default_version_key|
            ImageUrlHelper.public_url(public_send(name), key)
          end

          define_method(:"attach_#{name}_from_url") do |url|
            ImageUrlHelper.attach_from_url(public_send(name), url)
          end
        end

        validates name, {
          content_type: DefaultValues::ACCEPTED_IMAGE_TYPES,
          size: { less_than_or_equal_to: DefaultValues::MAX_IMAGE_FILE_SIZE },
          dimension: { max: DefaultValues::MAX_IMAGE_DIMENSION_SIZE },
        }.merge(options[:validates])
      end
    end

    class Helper
      PRESET_VERSIONS = {
        small: 160, medium: 320, large: 640,
        viewer: { resize_to_limit: [3840, 3840].freeze, saver: { quality: 90 }.freeze, preprocessed: false }.freeze
      }.freeze

      class << self
        # to change preprocessed globally
        attr_accessor :preprocessed

        Helper.preprocessed = true

        def block_for_attached(options)
          variant_options = generate_variant_options(options[:versions] || [options[:default_version_key]])

          proc do |attachable|
            variant_options.each { |key, opts| attachable.variant(key, opts) }
          end
        end

        def generate_variant_options(versions)
          versions.each_with_object({}) do |version, hash|
            version = { version => PRESET_VERSIONS[version] } if version.is_a?(Symbol)

            version.each do |key, opts|
              case opts
              when Integer
                opts = { resize_to_limit: [opts, opts] }
              when Array
                opts = { resize_to_limit: opts }
              end

              hash[key] = merge_options(opts)
            end
          end
        end

        def merge_options(options)
          opts = {}
          opts[:format] = options[:format] || :webp
          opts[:resize_to_limit] = options[:resize_to_limit] if options[:resize_to_limit]
          opts[:preprocessed] = options[:preprocessed].nil? ? preprocessed : options[:preprocessed]
          opts[:saver] = { strip: true, quality: 85 }

          opts[:saver].merge!(smart_subsample: true, lossless: false) if opts[:format] == :webp
          opts[:saver].merge!(options[:saver]) if options[:saver]
          opts
        end
      end
    end
  end
end
