### This repository is a demo site for my portfolio.

- Ruby 3.3.4
- Rails 7.2.2.1
- Redis 8.0.2 +
- Postgresql 15 +
- libvips 8.16.1 +
- node 22.14.0
- yarn 4.9.1 +
- bundler 2.6.6

---

## Install in development

### Mac OS X

Use Homebrew

```sh
brew install redis
brew install postgresql
brew install vips
```

Don't forget start redis and postgresql if you haven't start it before.

```sh
brew services start redis
brew services start postgresql
```

## Setup

Database creation
```sh
rails db:create
```

Database initialization
```sh
make reset
```

Foreman gem is not included in Gemfile, thus you may need to install that.  
[Foreman Wiki - Don't Bundle Foreman](https://github.com/ddollar/foreman/wiki/Don't-Bundle-Foreman)

```sh
gem install foreman
```

How to start the application
```sh
make dev
```

---

How to run the test suite
```sh
bundle exec rspec
```
