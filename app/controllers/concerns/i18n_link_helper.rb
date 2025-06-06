# frozen_string_literal: true

module I18nLinkHelper
  extend ActiveSupport::Concern
  include ActionView::Helpers::UrlHelper
  include I18nMessageHelper

  def flash_message_with_link(i18_key, url, options = {})
    options[:scope] ||= flash_scope
    link = link_to(t("#{i18_key}.name", **options), url)

    flash_message("#{i18_key}.text", link:, **options)
  end
end
