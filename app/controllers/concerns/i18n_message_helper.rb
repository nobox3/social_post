# frozen_string_literal: true

module I18nMessageHelper
  extend ActiveSupport::Concern

  def error_message(i18_key, options = {})
    unless options[:scope]
      model = options.delete(:model)
      options[:scope] = "activerecord.errors.#{model ? "models.#{model}" : 'messages'}"
    end

    { errors: t(i18_key, **options) }
  end

  def set_flash_message(i18_key, options = {})
    assign_message_to_flash(flash_message(i18_key, options))
  end

  def flash_message(i18_key, options = {})
    options[:scope] ||= flash_scope
    type = options.delete(:type) || :notice

    { text: t(i18_key, **options), type: }
  end

  def set_flash_message_for_action(model_class, options = {})
    assign_message_to_flash(flash_message_for_action(model_class, options))
  end

  def flash_message_for_action(model_class, options = {})
    options[:type] ||= :success
    options[:scope] ||= flash_scope("record.#{options.delete(:action) || action_name}")

    unless options[:record]
      attribute = options.delete(:attribute)
      options[:record] = attribute ? model_class.human_attribute_name(attribute) : model_class.model_name.human
    end

    flash_message(options[:type], options)
  end

  def flash_scope(scope = controller_name.singularize)
    "flash.#{scope}"
  end

  def assign_message_to_flash(message)
    flash[message[:type]] = message[:text]
  end
end
