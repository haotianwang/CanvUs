class PageController < ApplicationController

	def test_draw
		render "test_draw"
	end

	def draw
		render "draw"
	end

	def canvus
		render "canvus"
	end

	def draw2
		render "draw2"
	end

	def canvases
		canvasIDs = Canvas.getCanvasIDs()
		canvasJSON = {canvases: canvasIDs}.to_json
		render :json => canvasJSON
	end

end
