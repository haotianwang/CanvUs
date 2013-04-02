class Canvas < ActiveRecord::Base
  attr_accessible :bitmap_id, :user_username, :active

  validates :bitmap_id, :user_username, :active, presence: true

  has_one :bitmap
  #has_one :user

  def self.createCanvas(bitmapID)
    Canvas.create(bitmap_id: bitmapID, user_username: 'mylittlelucas888', active: true)
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

  def self.getCanvasIDs()
    canvases = Canvas.select("id").where("active = ?", true)
    canvases = canvases.map{|record| record[:id]}
    return canvases.join("|")
  end
end
