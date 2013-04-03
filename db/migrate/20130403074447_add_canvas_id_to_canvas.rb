class AddCanvasIdToCanvas < ActiveRecord::Migration
  def change
    add_column :canvas, :canvas_id, :integer
  end
end
