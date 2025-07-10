# frozen_string_literal: true

# == Route Map
#
#                                Prefix Verb     URI Pattern                                                                                       Controller#Action
#                                  root GET      /                                                                                                 top#top
#                      new_user_session GET      /users/sign_in(.:format)                                                                          users/sessions#new
#                          user_session POST     /users/sign_in(.:format)                                                                          users/sessions#create
#                  destroy_user_session DELETE   /users/sign_out(.:format)                                                                         users/sessions#destroy
# user_google_oauth2_omniauth_authorize GET|POST /users/auth/google_oauth2(.:format)                                                               users/omniauth_callbacks#passthru
#  user_google_oauth2_omniauth_callback GET|POST /users/auth/google_oauth2/callback(.:format)                                                      users/omniauth_callbacks#google_oauth2
#                     new_user_password GET      /users/password/new(.:format)                                                                     users/passwords#new
#                    edit_user_password GET      /users/password/edit(.:format)                                                                    users/passwords#edit
#                         user_password PATCH    /users/password(.:format)                                                                         users/passwords#update
#                                       PUT      /users/password(.:format)                                                                         users/passwords#update
#                                       POST     /users/password(.:format)                                                                         users/passwords#create
#              cancel_user_registration GET      /users/cancel(.:format)                                                                           users/registrations#cancel
#                 new_user_registration GET      /users/sign_up(.:format)                                                                          users/registrations#new
#                edit_user_registration GET      /users/edit(.:format)                                                                             users/registrations#edit
#                     user_registration PATCH    /users(.:format)                                                                                  users/registrations#update
#                                       PUT      /users(.:format)                                                                                  users/registrations#update
#                                       DELETE   /users(.:format)                                                                                  users/registrations#destroy
#                                       POST     /users(.:format)                                                                                  users/registrations#create
#                 new_user_confirmation GET      /users/confirmation/new(.:format)                                                                 users/confirmations#new
#                     user_confirmation GET      /users/confirmation(.:format)                                                                     users/confirmations#show
#                                       POST     /users/confirmation(.:format)                                                                     users/confirmations#create
#                       new_user_unlock GET      /users/unlock/new(.:format)                                                                       users/unlocks#new
#                           user_unlock GET      /users/unlock(.:format)                                                                           users/unlocks#show
#                                       POST     /users/unlock(.:format)                                                                           users/unlocks#create
#                          feed_account GET      /account/feed(.:format)                                                                           accounts#feed
#                       profile_account GET      /account/profile(.:format)                                                                        accounts#profile
#                 register_info_account GET      /account/register_info(.:format)                                                                  accounts#register_info
#                  app_settings_account GET      /account/app_settings(.:format)                                                                   accounts#app_settings
#                         posts_account GET      /account/posts(.:format)                                                                          accounts#posts
#                    followings_account GET      /account/followings(.:format)                                                                     accounts#followings
#                     followers_account GET      /account/followers(.:format)                                                                      accounts#followers
#                            posts_user GET      /users/:id/posts(.:format)                                                                        users#posts
#                       followings_user GET      /users/:id/followings(.:format)                                                                   users#followings
#                        followers_user GET      /users/:id/followers(.:format)                                                                    users#followers
#                                  user GET      /users/:id(.:format)                                                                              users#show
#        update_locale_api_app_settings PUT      /api/app_settings/update_locale(.:format)                                                         api/app_settings#update_locale
#    update_theme_mode_api_app_settings PUT      /api/app_settings/update_theme_mode(.:format)                                                     api/app_settings#update_theme_mode
#                      feed_api_account GET      /api/account/feed(.:format)                                                                       api/accounts#feed
#                   profile_api_account GET      /api/account/profile(.:format)                                                                    api/accounts#profile
#             register_info_api_account GET      /api/account/register_info(.:format)                                                              api/accounts#register_info
#              app_settings_api_account GET      /api/account/app_settings(.:format)                                                               api/accounts#app_settings
#                     posts_api_account GET      /api/account/posts(.:format)                                                                      api/accounts#posts
#                followings_api_account GET      /api/account/followings(.:format)                                                                 api/accounts#followings
#                 followers_api_account GET      /api/account/followers(.:format)                                                                  api/accounts#followers
#                           api_account PATCH    /api/account(.:format)                                                                            api/accounts#update
#                                       PUT      /api/account(.:format)                                                                            api/accounts#update
#                        posts_api_user GET      /api/users/:id/posts(.:format)                                                                    api/users#posts
#                   followings_api_user GET      /api/users/:id/followings(.:format)                                                               api/users#followings
#                    followers_api_user GET      /api/users/:id/followers(.:format)                                                                api/users#followers
#                     api_relationships POST     /api/relationships(.:format)                                                                      api/relationships#create
#                      api_relationship DELETE   /api/relationships/:id(.:format)                                                                  api/relationships#destroy
#                     api_auth_provider DELETE   /api/auth_providers/:id(.:format)                                                                 api/auth_providers#destroy
#                  attach_file_api_post PUT      /api/posts/:id/attach_file(.:format)                                                              api/posts#attach_file
#            delete_attachment_api_post PUT      /api/posts/:id/delete_attachment(.:format)                                                        api/posts#delete_attachment
#                             api_posts POST     /api/posts(.:format)                                                                              api/posts#create
#                              api_post PATCH    /api/posts/:id(.:format)                                                                          api/posts#update
#                                       PUT      /api/posts/:id(.:format)                                                                          api/posts#update
#                                       DELETE   /api/posts/:id(.:format)                                                                          api/posts#destroy
#           viewer_image_api_attachment GET      /api/attachments/:id/viewer_image(.:format)                                                       api/attachments#viewer_image
#                                health GET      /health(.:format)                                                                                 Inline handler (Proc/Lambda)
#                           sidekiq_web          /sidekiq                                                                                          Sidekiq::Web
#                     letter_opener_web          /letter_opener                                                                                    LetterOpenerWeb::Engine
#                             any_login          /any_login                                                                                        AnyLogin::Engine
#                    rails_service_blob GET      /rails/active_storage/blobs/redirect/:signed_id/*filename(.:format)                               active_storage/blobs/redirect#show
#              rails_service_blob_proxy GET      /rails/active_storage/blobs/proxy/:signed_id/*filename(.:format)                                  active_storage/blobs/proxy#show
#                                       GET      /rails/active_storage/blobs/:signed_id/*filename(.:format)                                        active_storage/blobs/redirect#show
#             rails_blob_representation GET      /rails/active_storage/representations/redirect/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations/redirect#show
#       rails_blob_representation_proxy GET      /rails/active_storage/representations/proxy/:signed_blob_id/:variation_key/*filename(.:format)    active_storage/representations/proxy#show
#                                       GET      /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format)          active_storage/representations/redirect#show
#                    rails_disk_service GET      /rails/active_storage/disk/:encoded_key/*filename(.:format)                                       active_storage/disk#show
#             update_rails_disk_service PUT      /rails/active_storage/disk/:encoded_token(.:format)                                               active_storage/disk#update
#                  rails_direct_uploads POST     /rails/active_storage/direct_uploads(.:format)                                                    active_storage/direct_uploads#create
#
# Routes for LetterOpenerWeb::Engine:
#       letters GET  /                                letter_opener_web/letters#index
# clear_letters POST /clear(.:format)                 letter_opener_web/letters#clear
#        letter GET  /:id(/:style)(.:format)          letter_opener_web/letters#show
# delete_letter POST /:id/delete(.:format)            letter_opener_web/letters#destroy
#               GET  /:id/attachments/:file(.:format) letter_opener_web/letters#attachment {:file=>/[^\/]+/}
#
# Routes for AnyLogin::Engine:
# sign_in POST /any_login/sign_in(.:format) any_login/application#any_login

require 'sidekiq/web'

Rails.application.routes.draw do
  root 'top#top'

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    confirmations: 'users/confirmations',
    unlocks: 'users/unlocks',
    omniauth_callbacks: 'users/omniauth_callbacks',
  }

  concern :profileable do
    get :posts
    get :followings
    get :followers
  end

  concern :account_actions do
    get :feed
    get :profile
    get :register_info
    get :app_settings
    concerns :profileable
  end

  resource :account, only: [] do
    concerns :account_actions
  end

  resources :users, only: %i[show] do
    member do
      concerns :profileable
    end
  end

  namespace :api do
    resources :app_settings, only: [] do
      collection do
        put :update_locale
        put :update_theme_mode
      end
    end

    resource :account, only: %i[update] do
      concerns :account_actions
    end

    resources :users, only: [] do
      member do
        concerns :profileable
      end
    end

    resources :relationships, only: %i[create destroy]
    resources :auth_providers, only: %i[destroy]

    resources :posts, only: %i[create update destroy] do
      member do
        put :attach_file
        put :delete_attachment
      end
    end

    resources :attachments, only: [] do
      get :viewer_image, on: :member
    end
  end

  get '/health', to: ->(_env) { [200, {}, ['']] }

  if Rails.env.local?
    direct :cdn_proxy do |representation|
      route_for(:rails_storage_proxy, representation, port: ENV.fetch('PORT', 3000))
    end

    mount Sidekiq::Web, at: '/sidekiq'
    mount LetterOpenerWeb::Engine, at: '/letter_opener'
  else
    direct :cdn_proxy do |representation|
      "https://#{ENV.fetch('ASSET_HOST')}/#{representation.key}"
    end

    authenticate :user, ->(u) { u.admin? } do
      mount Sidekiq::Web, at: '/sidekiq'
    end
  end
end
