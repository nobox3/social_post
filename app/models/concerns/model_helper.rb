# frozen_string_literal: true

module ModelHelper
  extend ActiveSupport::Concern

  class_methods do
    def paginate(options = {})
      PagyPagination.new(all, options)
    end

    def generate_alphanumeric(length = 16)
      SecureRandom.alphanumeric(length).downcase
    end

    def generate_unique_alphanumeric(column, length = 16)
      loop do
        value = generate_alphanumeric(length)

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

  def generate_alphanumeric(length = 16)
    self.class.generate_alphanumeric(length)
  end

  def assign_unique_alphanumeric(column, length = 16)
    self[column] = self.class.generate_unique_alphanumeric(column, length)
  end

  def human_enum_name(attribute)
    self.class.human_enum_name(attribute, self[attribute])
  end
end
