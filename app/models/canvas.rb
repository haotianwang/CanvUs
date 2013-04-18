class Canvas < ActiveRecord::Base
  attr_accessible :bitmap_id, :user_username, :active

  validates :user_username, presence: true

  def self.createCanvas()
    return Canvas.create(user_username: 'mylittlelucas888', active: true)
  end

  def self.setBitmap(canvasID, bitmapID)
    canvas = Canvas.where("id = ?", canvasID).first
    canvas[:bitmap_id] = bitmapID
    canvas.save
  end

  def self.setActivity(canvasID, active)
    canvas = Canvas.where("id = ?", canvasID).first
    canvas[:active] = active
    canvas.save
  end

  # Gets the Canvas record ids for all active canvases, i.e. canvases that are currently being drawn on.
  def self.getCanvasIDs()
    canvases = Canvas.select("id").where("active = ?", true)
    canvases = canvases.map{|record| record[:id]}
    return canvases.join("|")
  end
end
