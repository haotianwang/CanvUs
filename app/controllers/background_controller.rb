class BackgroundController < ApplicationController


  # Logic for keeping a variable threshold (numKeep) of bitmaps for
  # a given canvasID. Also deletes old actions that have been combined
  # into a bitmap. Used for garbage collection.
  def self.cleanUp(canvasID, numKeep)
    #find the numKeep-th bitmap's latest action timestamp
    oldestBitmapActionTimestamp = Bitmap.where("canvas_id = ?", canvasID).order("created_at DESC").limit(numKeep).last.latest_action_timestamp
    #delete oldest bitmap
    Bitmap.deleteBitmap(canvasID)
    #delete actions that happened before the latest action for the oldest bitmap
    Action.deleteActions(canvasID, oldestBitmapActionTimestamp)
  end
end