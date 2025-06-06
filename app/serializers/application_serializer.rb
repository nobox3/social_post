# frozen_string_literal: true

class ApplicationSerializer
  include JSONAPI::Serializer

  class << self
    include Rails.application.routes.url_helpers
    include ActionView::Helpers::DateHelper

    def serialize_collection(collection, options = {})
      options[:is_collection] = true
      output = new(collection, options).serializable_hash

      return [] if (resources = output[:data]).blank?

      included = output[:included]
      opt_include = options[:include]

      resources.map { |resource| serialize_resource(included, resource, opt_include) }
    end

    def serialize(object, options = {})
      options[:is_collection] = false
      output = new(object, options).serializable_hash

      return if (resource = output[:data]).blank?

      serialize_resource(output[:included], resource, options[:include])
    end

    def serialize_to_parents(children, on, parents, key, options = {})
      children = children.index_by(&on)

      parents.each do |parent|
        if (child = children[parent[:id]])
          parent[key] = serialize(child, options)
        end
      end

      parents
    end

    def format_datetime(datetime, format = :default)
      format == :time_ago_in_words ? time_ago_in_words(datetime) : I18n.l(datetime, format:)
    end

    private

      def serialize_resource(included, resource, opt_include)
        result = resource[:attributes]

        return result if opt_include.blank? || (relationships = resource[:relationships]).blank?

        resolve_rel_keys(opt_include).each do |rel_keys|
          serialize_included(included, relationships, rel_keys, result)
        end

        result
      end

      def resolve_rel_keys(opt_include)
        opt_include.map { |rel_key| rel_key.to_s.split('.').map(&:to_sym) }
      end

      def serialize_included(included, relationships, rel_keys, result)
        rel_key = rel_keys.shift
        rel_data = relationships.dig(rel_key, :data)
        resources = serialize_relation(included, rel_data, rel_keys)

        return if resources.blank?

        result[rel_key] = rel_data.is_a?(Array) ? resources : resources[0]
      end

      def serialize_relation(included, rel_data, rel_keys)
        Array.wrap(rel_data).filter_map do |rel_d|
          next if (resource = find_resource(included, rel_d)).blank?

          result = resource[:attributes]

          if rel_keys.present? && (relationships = resource[:relationships]).present?
            serialize_included(included, relationships, rel_keys.dup, result)
          end

          result
        end
      end

      def find_resource(included, rel_data)
        included.find { |resource| equals_resource?(rel_data, resource) }
      end

      def equals_resource?(rel_data, resource)
        rel_data[:id] == resource[:id] && rel_data[:type] == resource[:type]
      end
  end
end
