# syntax = docker/dockerfile:1

# ------------------------------
#  Build stage for Rails app
# ------------------------------
# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
FROM ruby:3.3.4-slim AS base

# Rails app lives here
WORKDIR /rails

# Set production environment
ENV RAILS_ENV="production" \
    NODE_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development test"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build gems
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential curl git libpq-dev libvips pkg-config

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Install Node.js and Yarn
RUN curl -fsSL https://raw.githubusercontent.com/tj/n/master/bin/n | bash -s install 22.14.0
RUN corepack enable yarn && yarn workspaces focus --production && yarn install --immutable

# Precompiling assets for production without requiring secret RAILS_MASTER_KEY
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails shakapacker:compile "json_translations:dump[minify]"

# Remove unnecessary files to reduce image size
RUN rm -rf node_modules package.json yarn.lock .yarnrc.yml .yarn tsconfig.json babel.config.mjs app/javascript

# ------------------------------
#  Final stage for Rails app
# ------------------------------
# Final stage for app image
FROM base AS web

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libvips postgresql-client gosu && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built artifacts: gems, application
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# Run and own only the runtime files as a non-root user for security
# and will change to this user from root　at the entrypoint
RUN useradd rails -m -s /bin/bash && \
    chown -R rails:rails db log storage tmp

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD ["./bin/rails", "server"]

# ------------------------------
#  Nginx stage for serving static files
# ------------------------------
FROM nginx:1.29.0-alpine

COPY --from=web /rails/public /usr/share/nginx/html
COPY --from=web /rails/nginx/default.conf /etc/nginx/templates/default.conf.template
COPY --from=web /rails/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
