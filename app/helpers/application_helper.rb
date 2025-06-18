# frozen_string_literal: true

module ApplicationHelper
  def i18n_meta_for_path
    i18n_params_for_path = props[:i18n_params_for_path]

    t(i18n_params_for_path[:key],
      **i18n_params_for_path[:interpolation],
      deep_interpolation: true,
      scope: :meta,
      default: :default)
  end

  def sanitize_description(text)
    text.to_s.gsub(/\s+/, ' ').strip
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
    description = sanitize_description(i18n_meta[:description])

    # meta = decorator&.meta
    # image = meta[:image].presence || image_url('/images/ogp_share.png')

    canonical_url = sanitized_canonical_url
    site_name = DefaultValues::SITE_NAME

    # https://github.com/kpumuk/meta-tags/
    display_meta_tags({
      site: site_name,
      title:,
      description:,
      keywords: '',
      reverse: true,
      charset: 'utf-8',
      canonical: canonical_url,
      # icon: [
      #   { href: '/favicon.ico' },
      #   { href: '/apple-touch-icon.png', rel: 'apple-touch-icon', sizes: '180x180', type: 'image/jpg' },
      # ],
      og: {
        site_name:,
        title:,
        description:,
        # image:,
        type: 'website',
        url: canonical_url,
        locale: DefaultValues::LOCALE_LONG[I18n.locale],
      },
      twitter: {
        card: 'summary',
        # site: '',
        title:,
        description:,
        # image:,
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
