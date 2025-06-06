# frozen_string_literal: true

module BitFlags
  extend ActiveSupport::Concern

  class_methods do
    def as_flags(attribute, options = {})
      options[:attribute] = attribute
      name = :"#{options[:name] || attribute}_flags"
      var = :"@#{name}"

      define_method(name) do
        instance_variable_get(var) || instance_variable_set(var, Helper.new(self, options))
      end
    end
  end

  class Helper
    class KeyNotInUsedError < KeyError; end

    def initialize(resource, options = {})
      @resource = resource
      @attribute = options[:attribute]
      @used_bits = options[:used_bits]
    end

    def on?(key)
      is_on?(current_value, used_bit(key))
    end

    def off?(key)
      !on?(key)
    end

    def complete?
      current_value.allbits?(used_bits.values.sum { |bit_at| 1 << bit_at })
    end

    def incomplete?
      !complete?
    end

    def values
      value = current_value
      used_bits.transform_values { |bit_at| is_on?(value, bit_at) }
    end

    def on_values
      value = current_value
      used_bits.each_with_object({}) { |(key, bit_at), hash| hash[key] = true if is_on?(value, bit_at) }
    end

    def assign(key, enabled)
      assign_value(value_by(key, enabled))
    end

    def update(key, enabled)
      update_value(value_by(key, enabled))
    end

    def update!(key, enabled)
      update_value!(value_by(key, enabled))
    end

    private

      def current_value
        @resource.public_send(@attribute)
      end

      def assign_value(value)
        @resource.public_send(:"#{@attribute}=", value)
      end

      def update_value(value)
        @resource.update_attribute(@attribute, value)
      end

      def update_value!(value)
        @resource.update_attribute!(@attribute, value)
      end

      def used_bits
        @used_bits = @used_bits.is_a?(Proc) ? @used_bits.call(@resource) : @used_bits
      end

      def used_bit(key)
        used_bits[key] || raise(KeyNotInUsedError, "key not in used: #{key.inspect} for #{@resource.inspect}")
      end

      def is_on?(value, bit_at)
        value.anybits?(1 << bit_at)
      end

      def value_by(key, enabled)
        enabled ? current_value | bit_value(key) : current_value & ~bit_value(key)
      end

      def bit_value(key)
        1 << used_bit(key)
      end
  end
end
