require 'file_helper'

def to_constants_hash(const)
  const.constants(false).each_with_object({}) do |name, hash|
    value = const.const_get(name, false)

    case value
    when Module, Class
      hash[name] = to_constants_hash(value)
    when Range
      hash[name] = value.first
    else
      hash[name] = value
    end
  end
end

namespace :json_constants do
  desc 'Dump app/constants/default_values to frontend constants.'
  task dump: :environment do
    root_module_name = 'DefaultValues'

    if root_module_name.safe_constantize
      Object.send(:remove_const, root_module_name)
      load Rails.root.join('app', 'constants', "#{root_module_name.underscore}.rb")

      FileHelper.write_json_file(
        to_constants_hash(root_module_name.safe_constantize), 'app/javascript/src/static', 'backend_constants',
      )
    end
  end

  desc 'Start watching for app/constants/default_values.rb to be modified.'
  task watch: :environment do |task|
    FileHelper.auto_dump('json_constants:dump', task:, src_dirs: 'app/constants', only: %r{^default_values.rb$})
  end
end
