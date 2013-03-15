class AddLatestActionTimestampToBitmaps < ActiveRecord::Migration
  def change
    add_column :bitmaps, :latest_action_timestamp, :timestamp
  end
end
