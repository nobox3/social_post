class AddInitialColumnsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :admin, :boolean, null: false, default: false
    add_column :users, :email_verified, :boolean, null: false, default: false
    add_column :users, :password_set_by_system, :boolean, null: false, default: false
    add_column :users, :suspended, :boolean, null: false, default: false
    add_column :users, :username, :string, null: false
    add_column :users, :language, :string, null: false
    add_column :users, :theme_mode, :integer, null: false, default: 0
    add_column :users, :deleted_at, :datetime

    add_column :users, :slug, :string, null: false
    add_index :users, :slug, unique: true
  end
end
