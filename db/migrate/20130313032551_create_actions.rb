class CreateActions < ActiveRecord::Migration
  def change
    create_table :actions do |t|
      t.integer :canvas_id
      t.text :action

      t.timestamps
    end
  end
end
