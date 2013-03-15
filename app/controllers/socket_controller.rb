class SocketsController < WebsocketRails::BaseController
	
  def initialize_session
    controller_store[:action_count] = 0
	end
	
	def get_action_handler
    Action.storeAction(message['action'], message['canvasID'])
    controller_store[:action_count] += 1
		broadcast_message :get_action, message['action'], :namespace => 'socket'
	end

	def send_init_img
    bitmap = Bitmap.getBitmap(message['canvasID'])
    actions = Action.getActions(message['canvasID'])
		broadcast_message :get_init_img, {user: message['user'], bitmap: bitmap, actions: actions}, :namespace => 'socket'
	end
  # Why use WebSockets for send_init_img? We can just use a regular HTTP request.
end
