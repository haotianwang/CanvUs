class Canvas < ActiveRecord::Base
  set_primary_key :canvas_id

  attr_accessible :canvas_id, :bitmap_id, :user_username, :active

  validates :canvas_id, :bitmap_id, :user_username, :active, presence: true

  def self.createCanvas(canvasID, bitmapID)
    Canvas.create(canvas_id: canvasID, bitmap_id: bitmapID, user_username: 'mylittlelucas888', active: true)
  end

  def self.setBitmap(canvasID, bitmapID)
    canvas = Canvas.where("canvas_id = ?", canvasID).first
    canvas[:bitmap_id] = bitmapID
    canvas.save
  end

  def self.setActivity(canvasID, active)
    canvas = Canvas.where("canvas_id = ?", canvasID).first
    canvas[:active] = active
    canvas.save
  end

  def self.getCanvasIDs()
    canvases = Canvas.select("canvas_id").where("active = ?", true)
    canvases = canvases.map{|record| record[:canvas_id]}
    return canvases.join("|")
  end
end
