class CreateAuthProviders < ActiveRecord::Migration[7.2]
  def change
    create_table :auth_providers do |t|
      t.integer :provider, null: false
      t.string :uid, null: false
      t.references :user, foreign_key: true

      t.timestamps
    end

    add_index :auth_providers, %i[provider uid user_id], unique: true
  end
end
