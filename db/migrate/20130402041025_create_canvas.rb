class CreateCanvas < ActiveRecord::Migration
  def change
    create_table :canvas do |t|
      t.integer :bitmap_id
      t.string :user_username
      t.boolean :active

      t.timestamps
    end
  end
end
