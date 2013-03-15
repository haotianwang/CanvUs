require 'json'

class SocketController < WebsocketRails::BaseController

  # Initializes action_count to 0, which will be incremented each time an action is received from a client.
  def initialize_session
    controller_store[:action_count] = 0
  end
  
  # Stores an action in the database and increments the action count, which will keep track of how many actions
  # have been done since the canvas state was last saved. Afterwards, broadcasts the action to all connected
  # clients.
  def get_action_handler
    Action.storeAction(message, 0) # For first iteration, there is only a single canvas, so use canvasID == 0.
    controller_store[:action_count] += 1
    broadcast_message :get_action, message, :namespace => 'socket'
  end

  # Retrieves the most recent canvas state stored in the database as well as any actions that have been done
  # since that canvas state was stored to send to a newly connected client.
  def send_init_img
    bitmap = Bitmap.getBitmap(0)
    actions = Action.getActions(0)
    return_message = {bitmap: bitmap, actions: actions}.to_json
    send_message :get_init_img, return_message, :namespace => 'socket'
  end
end
