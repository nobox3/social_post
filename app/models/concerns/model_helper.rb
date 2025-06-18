# frozen_string_literal: true

module ModelHelper
  extend ActiveSupport::Concern

  class_methods do
    def paginate(options = {})
      PagyPagination.new(all, options)
    end

    def generate_alphanumeric(options = {})
      value = SecureRandom.alphanumeric(options.fetch(:length, 16))
      value.downcase! if options.fetch(:downcase, true)

      "#{options.fetch(:prefix, '')}#{value}"
    end

    def generate_unique_alphanumeric(column, options = {})
      loop do
        value = generate_alphanumeric(options)

        break value unless exists?(column => value)
      end
    end

    def human_enum_name(attribute, value)
      human_attribute_name("#{attribute}.#{value}")
    end

    def human_enum_names(attribute)
      public_send(attribute.to_s.pluralize).each_with_object({}) do |(k, _v), hash|
        hash[k.to_sym] = human_enum_name(attribute, k)
      end
    end
  end

  def generate_alphanumeric(options = {})
    self.class.generate_alphanumeric(options)
  end

  def assign_unique_alphanumeric(column, options = {})
    self[column] = self.class.generate_unique_alphanumeric(column, options)
  end

  def human_enum_name(attribute)
    self.class.human_enum_name(attribute, self[attribute])
  end
end
