namespace :route_map do
  desc 'Write routes to "config/routes.rb".'
  task write: :environment do
    file_path = Rails.root.join('config', 'routes.rb')
    tmp_path = Rails.root.join('tmp', 'route_map_tmp')
    prefix = '# == Route Map'

    File.open(tmp_path, 'w+') do |tmp|
      system("bin/rails routes > #{tmp_path}")

      tmp_lines = tmp.map { |line| line.strip.empty? ? "#\n" : "# #{line}" }

      tmp_lines.unshift("#{prefix}\n", "#\n")
      tmp_lines.push("\n")

      lines = File.readlines(file_path)
      start_index = lines.find_index { |line| !line.start_with?('#', /\s/) }.to_i

      if (printed_start = lines.find_index { |line| line.start_with?(prefix) })
        start_index -= lines.slice!(printed_start...start_index)&.length
      end

      File.write(file_path, lines.insert(start_index, *tmp_lines).join)
    end

    File.delete(tmp_path)
  end
end
