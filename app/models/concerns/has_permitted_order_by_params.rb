# frozen_string_literal: true

module HasPermittedOrderByParams
  extend ActiveSupport::Concern

  SORT_KEY = :s

  class_methods do
    # Return a hash of permitted sort keys and their values. The values can be a hash, a symbol, or a proc.
    # e.g. { high_price: { price: :desc }, recent: :recent, by_name: -> { order(:name) } }
    def permitted_order_by_params(_options)
      raise NotImplementedError, "must implement `permitted_order_by_params` method in #{self} model"
    end

    def order_by_permitted(params, options = {})
      return none if (permitted_sorts = permitted_order_by_params(options)).blank?

      sort_name = params[SORT_KEY]&.to_sym

      if sort_name.blank? || (sort_value = permitted_sorts[sort_name]).blank?
        sort_value = permitted_sorts.values.first
      end

      return order(sort_value) if sort_value.is_a?(Hash)
      return sort_value.call if sort_value.is_a?(Proc)

      respond_to?(sort_value) ? public_send(sort_value) : none
    end
  end
end
