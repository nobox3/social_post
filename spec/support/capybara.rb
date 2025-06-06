require 'capybara/rspec'
require 'capybara-screenshot/rspec'

driver_name = :selenium_chrome_headless

Capybara.default_driver = driver_name
Capybara.javascript_driver = driver_name

Capybara::Screenshot.prune_strategy = { keep: 10 }
Capybara::Screenshot.register_driver(driver_name) do |driver, path|
  driver.browser.save_screenshot(path)
end
