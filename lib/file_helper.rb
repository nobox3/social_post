# frozen_string_literal: true

# rubocop:disable Rails/Output, Lint/MissingCopEnableDirective

require 'fileutils'

class FileHelper
  class << self
    def write_json_file(hash, dest_dir, file_name, minify: false)
      FileUtils.mkdir_p(dest_dir)

      json_path = "#{dest_dir}/#{file_name}.json"

      File.write(json_path, minify ? JSON.generate(hash) : JSON.pretty_generate(hash))
      puts "create: #{json_path}"
    end

    def yaml_to_hash(src_dirs, options = {})
      Yaml.new(options).yaml_to_hash(src_dirs)
    end
  end

  class Yaml
    def initialize(options = {})
      @options = options
    end

    def yaml_to_hash(src_dirs)
      Array.wrap(src_dirs).each_with_object({}) do |src_dir, dest_hash|
        unless (yaml_paths = get_yaml_paths(src_dir))
          puts "warning: No YAML files for #{src_dir}"
          next
        end

        to_hash_from_yaml(dest_hash, yaml_paths)
      end
    end

    private

      def get_yaml_paths(src_dir)
        yaml_paths = []

        Dir.glob("#{src_dir}/**/#{@options[:only].presence || '*'}.yml") do |path|
          relative_path = path.delete_prefix("#{src_dir}/")

          yaml_paths << path unless Array.wrap(@options[:ignore]).any? { |regexp| relative_path.match?(regexp) }
        end

        yaml_paths.empty? ? nil : yaml_paths
      end

      def to_hash_from_yaml(dest_hash, yaml_paths)
        hash_root_key = @options[:hash_root_key]

        yaml_paths.each do |yaml_path|
          unless File.exist?(yaml_path)
            puts "warning: No such YAML file #{yaml_path}"
            next
          end

          src_hash = YAML.parse_file(yaml_path).to_ruby
          src_hash = src_hash[hash_root_key.to_s] if hash_root_key.present?

          deep_merge(dest_hash, src_hash, yaml_path)
        end
      rescue Psych::SyntaxError => e
        puts "warning: Parsing skipped for \"#{File.basename(e.file)}\" due to YAML syntax error:"
        puts " - #{e.inspect}"
      end

      def deep_merge(dest_hash, src_hash, yaml_path, parent_keys = [])
        unless src_hash.is_a?(Hash)
          puts "warning: Merge was skipped for \"#{File.basename(yaml_path)}\" due to invalid source of no hash."
          return
        end

        dest_hash.merge!(src_hash) do |key, self_val, other_val|
          if self_val.is_a?(Hash) && other_val.is_a?(Hash)
            deep_merge(self_val, other_val, yaml_path, parent_keys << key)
          else
            translation_key = parent_keys.join('.')
            file_name = File.basename(yaml_path)

            puts "warning: The translation for \"#{translation_key}\" in \"#{file_name}\" was not dumped due to duplicate key."
          end

          self_val
        end
      end
  end
end
