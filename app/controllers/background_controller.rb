class BackgroundController < ApplicationController


  # Logic for keeping a variable threshold (numKeep) of bitmaps for
  # a given canvasID. Also deletes old actions that have been combined
  # into a bitmap. Used for garbage collection.
  def self.cleanUp(canvasID, numKeep)
    # find the numKeep-th bitmap's latest action timestamp
    bitmaps = Bitmap.where("canvas_id = ?", canvasID).order("created_at DESC").limit(numKeep)
    # deletes old bitmap and actions only if the number of bitmaps we have
    # for that canvasID is more than the number we want to keep (numKeep)
    if (bitmaps.count>numKeep)
      # delete oldest bitmap
      Bitmap.deleteBitmap(canvasID)
      # delete actions that happened before the latest action for the oldest bitmap
      Action.deleteActions(canvasID, bitmaps.last.latest_action_timestamp)
    end
  end
end