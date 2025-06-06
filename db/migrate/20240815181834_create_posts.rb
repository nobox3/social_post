class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.text :body, null: false, default: ''
      t.string :slug, null: false
      t.datetime :sent_at
      t.datetime :deleted_at
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
