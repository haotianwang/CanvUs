class CreateCanvas < ActiveRecord::Migration
  def change
    create_table :canvas do |t|
      t.integer :bitmap_id
      t.string :user_username
      t.boolean :active

      t.timestamps
    end
    execute "ALTER TABLE canvas ADD PRIMARY KEY (canvas_id);"
  end
end
