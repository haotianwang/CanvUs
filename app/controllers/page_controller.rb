class PageController < ApplicationController

  def draw
    render "draw"
  end

	def welcome
		render "welcome"
	end

	def canvus
		render "canvus"
	end

  def canvases
    canvasIDs = Canvas.getCanvasIDs()
    canvasesJSON = {canvases: canvasIDs}.to_json
    render :json => canvasesJSON
  end

  def new_canvas
    canvas = Canvas.createCanvas()
    bitmapID = Bitmap.storeBitmap('', DateTime.new(2000, 1, 1), canvas[:id])
    Canvas.setBitmap(canvas[:id], bitmapID)
    canvasIDJSON = {canvasID: canvas[:id]}.to_json
    render :json => canvasIDJSON
  end

  def chat
    render "chat"
  end
end
