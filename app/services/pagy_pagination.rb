# frozen_string_literal: true

require 'pagy/extras/overflow'

class PagyPagination
  attr_reader :pagy

  def initialize(scope, options = {})
    @scope = scope
    options[:limit] = @scope.klass::PAGINATES_PER if @scope.klass.const_defined?(:PAGINATES_PER)
    options[:overflow] ||= :last_page
    @pagy = Pagy.new(count: @scope.size, **options)
  end

  def count
    pagy.count
  end

  def empty?
    count.zero?
  end

  def records
    @records ||= @scope.offset(pagy.offset).limit(pagy.limit)
  end

  def meta
    @meta ||= {
      current_page: pagy.page,
      total_pages: pagy.pages,
      next_page: pagy.next,
      prev_page: pagy.prev,
      total_count: count,
    }
  end
end
