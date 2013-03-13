class Bitmap < ActiveRecord::Base
  attr_accessible :bitmap, :canvas_id

  def self.storeBitmap(bitmap, canvasID)
  	newBitmap = Bitmap.new(bitmap: bitmap, canvas_id: canvasID)
  	newBitmap.save
  end

  def self.getBitmap(canvasID)
  	latestBitmap = Bitmap.connection.execute("SELECT B.bitmap
                                              FROM Bitmap B
                                              WHERE B.canvas_id = #{canvasID}
                                              ORDER BY DESC
                                              LIMIT 1")
  	if latestBitmap.empty?
  		return ''
  	else
  		return latestBitmap[0]['bitmap']
  	end
  end

end
