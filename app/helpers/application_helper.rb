# frozen_string_literal: true

module ApplicationHelper
  def i18n_meta_for_path
    key_for_path = i18n_params_for_path[:key]
    options = { **i18n_params_for_path[:interpolation], scope: [:meta, key_for_path], default: '' }

    i18n_meta = %i[description keywords].index_with do |item_key|
      translate_meta(item_key, options).presence || t(item_key, scope: 'meta.default')
    end

    page_name = translate_meta(:page_name, options)
    title = t('meta.title')
    i18n_meta[:title] = page_name.present? ? "#{page_name} | #{title}" : title
    i18n_meta
  end

  def translate_meta(item_key, options)
    # value が空のこともあるので key による fallback は使用しない
    t(item_key, **options).presence || t(item_key, **options, scope: options[:scope] + [:default])
  end

  def sanitized_canonical_url
    filtered_query = request.query_parameters.slice(*DefaultValues::PERMITTED_SEARCH_PARAMS)
    canonical_url = request.base_url + request.path
    canonical_url += "?#{filtered_query.to_query}" if filtered_query.present?
    canonical_url
  end

  def custom_meta_tags(options = {})
    i18n_meta = i18n_meta_for_path
    title = i18n_meta[:title]
    description = i18n_meta[:description].to_s.gsub(/\s+/, ' ').strip
    canonical_url = sanitized_canonical_url

    # https://github.com/kpumuk/meta-tags/
    display_meta_tags({
      title:,
      description:,
      keywords: i18n_meta[:keywords],
      charset: 'utf-8',
      canonical: canonical_url,
      # icon: [
      #   { href: '/favicon.ico' },
      #   { href: '/apple-touch-icon.png', rel: 'apple-touch-icon', sizes: '180x180', type: 'image/jpg' },
      # ],
      og: {
        site_name: title,
        title:,
        description:,
        # image: (decorator&.meta || {})[:image].presence || image_url('/images/ogp_share.webp'),
        type: 'website',
        url: canonical_url,
        locale: DefaultValues::LOCALE_LONG[I18n.locale],
      },
      twitter: {
        card: 'summary',
        # site: '',
      },
    }.merge(options || {}))
  end

  # This meta used in app/javascript/src/core/i18n
  def locale_meta_tag
    tag.meta(
      name: 'i18n-locale-info',
      content: {
        default_locale: I18n.default_locale,
        locale: I18n.locale,
        available_locales: I18n.available_locales,
      }.to_json,
    )
  end

  # This meta used in app/javascript/src/components/providers/UserThemeProvider
  def theme_mode_meta_tag
    tag.meta(
      name: 'theme-mode',
      content: { user_theme_mode:, available_modes: theme_modes.keys }.to_json,
    )
  end
end
