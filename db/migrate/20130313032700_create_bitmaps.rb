class CreateBitmaps < ActiveRecord::Migration
  def change
    create_table :bitmaps do |t|
      t.integer :canvas_id
      t.text :bitmap

      t.timestamps
    end
  end
end
