module RequestSpecHelper
  def env_config
    Rails.application.env_config
  end

  def json_data
    JSON.parse(response.body, symbolize_names: true)
  end
end
