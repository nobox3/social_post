# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  admin                  :boolean          default(FALSE), not null
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :string
#  deleted_at             :datetime
#  email                  :string           default(""), not null
#  email_verified         :boolean          default(FALSE), not null
#  encrypted_password     :string           default(""), not null
#  failed_attempts        :integer          default(0), not null
#  followers_count        :integer          default(0), not null
#  followings_count       :integer          default(0), not null
#  language               :string           not null
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :string
#  locked_at              :datetime
#  password_set_by_system :boolean          default(FALSE), not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  sign_in_count          :integer          default(0), not null
#  slug                   :string           not null
#  suspended              :boolean          default(FALSE), not null
#  theme_mode             :integer          default("device"), not null
#  unconfirmed_email      :string
#  unlock_token           :string
#  username               :string           not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_slug                  (slug) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#
class User < ApplicationRecord
  include FileAttachable::Image
  include Discard::Model
  include ActsAsSluggable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable, :lockable, :timeoutable, :trackable,
         :omniauthable, omniauth_providers: AuthProvider.providers.keys

  self.discard_column = :deleted_at

  has_one_attached_image(name: :avatar, versions: [medium: 96, large: 288])

  enum :theme_mode, { device: 0, light: 1, dark: 2 }

  # associations
  has_many :auth_providers, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :active_relationships, inverse_of: :follower, foreign_key: :follower_id, class_name: 'Relationship', dependent: :destroy
  has_many :passive_relationships, inverse_of: :followed, foreign_key: :followed_id, class_name: 'Relationship', dependent: :destroy
  has_many :followings, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower

  # scopes
  scope :admin, -> { where(admin: true) }
  scope :not_admin, -> { where(admin: false) }
  scope :enabled, -> { kept.where(suspended: false) }
  scope :select_relationship_id, ->(table = :relationships) { select('users.*', table => { id: :relationship_id }) }
  scope :with_relationship_id, ->(relationships) {
    select_relationship_id(:sub).joins("LEFT OUTER JOIN (#{relationships.to_sql}) AS sub ON sub.followed_id = users.id")
  }

  # validations
  validates :email, email_format: { message: :invalid }
  validates :password, format: { with: DefaultValues::VALID_PASSWORD_REGEX }, if: :will_save_change_to_encrypted_password?
  validates :username, presence: true, length: { maximum: DefaultValues::MAX_TEXT_COUNT }

  # callbacks
  before_validation :prepare_to_create, on: :create
  before_update -> { self.email_verified = true }, if: :will_save_change_to_confirmed_at?, unless: :email_verified?
  after_save_commit :send_registration_done_email, if: -> { saved_change_to_confirmed_at?(from: nil) && email_verified? }
  after_discard :process_after_discard

  # "active_for_authentication?" and "inactive_message" are provided by the devise gem to be overwritten for customization.
  # https://github.com/heartcombo/devise/blob/main/lib/devise/models/authenticatable.rb
  def active_for_authentication?
    enabled? && super
  end

  def inactive_message
    return :invalid unless enabled?

    super
  end

  def enabled?
    kept? && !suspended?
  end

  def confirmed_email_exists?
    confirmed? && email_verified?
  end

  def can_be_email_notified?
    enabled? && confirmed_email_exists?
  end

  private

    def prepare_to_create
      self.language = I18n.locale if language.blank?
      assign_unique_alphanumeric(:username, prefix: 'user-', length: 10) if username.blank?
    end

    def send_registration_done_email
      UserMailer.with(user: self).registration_done.deliver_later
    end

    def process_after_discard
      posts.discard_all

      if confirmed_email_exists?
        UserMailer.with(user: self).account_destroy.deliver_now
      end

      prefix = deleted_at.to_i

      update_column(:email, "#{prefix}_#{email}")
      auth_providers.each { |auth_provider| auth_provider.update_column(:uid, "#{prefix}_#{auth_provider.uid}") }
    end
end
