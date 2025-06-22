# frozen_string_literal: true

# rubocop:disable Rails/Output, Lint/MissingCopEnableDirective

require 'listen'

class WatchHelper
  class AlreadyWatchingError < StandardError; end

  class << self
    def auto_dump(task_name_to_dump, task:, src_dirs:, only: nil, ignore: nil)
      task_to_dump = Rake::Task[task_name_to_dump]

      watch_files(
        task:,
        src_dirs:,
        only:,
        ignore:,
        before_listen: -> {
          puts "Dump files once to be consistent by #{task_name_to_dump}"
          task_to_dump.invoke
          task_to_dump.reenable
        },
      ) do
        task_to_dump.invoke
        task_to_dump.reenable
      end
    end

    def watch_files(task:, src_dirs:, only: nil, ignore: nil, before_listen: nil, &)
      unless block_given?
        raise ArgumentError, 'A block is required to be passed to the listen method.'
      end

      name_pattern = "#{task}$"

      if system("ps r | grep -c -e '#{name_pattern}' | [ $(xargs) -gt 1 ]")
        raise AlreadyWatchingError, "'#{task}' is already running."
      end

      before_listen&.call

      src_dirs = Array.wrap(src_dirs)

      puts "Start watching #{src_dirs.join(', ')}", 'Press Ctrl+C to exit'

      # https://github.com/guard/listen
      listener = Listen.to(*src_dirs, only:, ignore:) do |modified, added, removed|
        { modified:, added:, removed: }.each do |key, paths|
          if paths.present?
            puts "#{key}:"
            paths.each { |path| puts " - #{path}" }
          end
        end

        yield
      end

      listener.start

      Signal.trap(:INT) do
        puts "Exit #{task}"
        exit # rubocop:disable Rails/Exit
      end

      sleep
    end
  end
end
