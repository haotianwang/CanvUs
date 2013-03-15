class Bitmap < ActiveRecord::Base
  attr_accessible :bitmap, :canvas_id

  # Stores the bitmap representing a particular canvas's state.
  def self.storeBitmap(bitmap, canvasID)
    newBitmap = Bitmap.new(bitmap: bitmap, canvas_id: canvasID)
    newBitmap.save
  end

  # Gets the most recently stored bitmap for a particular canvas.
  def self.getBitmap(canvasID)
    latestBitmap = Bitmap.connection.execute("SELECT B.bitmap
                                              FROM Bitmaps B
                                              WHERE B.canvas_id = #{canvasID}
                                              ORDER BY B.created_at DESC
                                              LIMIT 1")
    if latestBitmap.count == 0 # If no bitmap has been stored for a particular
      return ''                # canvas, then return an empty string.
    else
      return latestBitmap[0]['bitmap'] # Since the query returns a list of
    end                                # of hashes, return the bitmap field
  end                                  # of the one entry in the query result.
end
