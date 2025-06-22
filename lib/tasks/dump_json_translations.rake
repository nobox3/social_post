require 'file_helper'

src_dirs = ['config/locales_common', 'config/locales_frontend']

namespace :json_translations do
  desc 'Dump translations from config/locales (YAML) to public/locales (JSON).'
  task :dump, %i[minify] => :environment do |_task, args|
    minify = args.minify == 'minify'
    public_locales_dir = Rails.public_path.join('locales')

    I18n.available_locales.each do |locale|
      translation = FileHelper.yaml_to_hash(src_dirs, only: "{*.,}#{locale}", hash_root_key: locale)

      FileHelper.write_json_file(translation, "#{public_locales_dir}/#{locale}", 'translation', minify:)
    end
  end

  if Rails.env.development?
    require 'development/watch_helper'

    desc 'Start watching for YAML translations to be modified.'
    task watch_yaml: :environment do |task|
      WatchHelper.auto_dump('json_translations:dump', task:, src_dirs:, only: %r{.yml$})
    end
  end
end
