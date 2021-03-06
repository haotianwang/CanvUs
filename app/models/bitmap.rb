class Bitmap < ActiveRecord::Base
  attr_accessible :bitmap, :latest_action_timestamp, :canvas_id

  validates :canvas_id, presence: true

  # Stores the bitmap representing a particular canvas's state.
  def self.storeBitmap(bitmap, latestActionTimeStamp, canvasID)
    newBitmap = Bitmap.create(bitmap: bitmap, latest_action_timestamp: latestActionTimeStamp, canvas_id: canvasID)
    return newBitmap[:id]
  end

  # Gets the most recently stored bitmap for a particular canvas.
  def self.getBitmap(canvasID)
    return Bitmap.where("canvas_id = ?", canvasID).order("created_at DESC").first
  end
  
  # Deletes the oldest bitmap with a given canvas id. Used for
  # garbage collection.
  def self.deleteBitmaps(canvasID, numToDelete)
    bitmapList = Bitmap.where("canvas_id = ?", canvasID).order("created_at ASC").limit(numToDelete)
    Bitmap.transaction do
      bitmapList.each do |bitmap|
       bitmap.destroy
      end
    end
  end
end
