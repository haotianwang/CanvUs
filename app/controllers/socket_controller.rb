require 'json'

class SocketController < WebsocketRails::BaseController

  def initialize_session
  end
  
  # Stores an action in the database and generates the first Bitmap and Canvas records for a particular canvasID
  # if they do not yet have any records in the database. Afterwards, broadcasts the action to all connected
  # clients.
  def get_action_handler(test_message = nil)
    if !test_message.nil?
      message = test_message
    end
    message_json = JSON.parse(message)
    action = message_json['message']
    canvas_id = message_json['canvasID']
    if Canvas.find(canvas_id).nil?
      return
    end
    timestamp = Action.storeAction(action, canvas_id)
    response = {message: action, timestamp: timestamp}
    WebsocketRails[canvas_id.to_s].trigger(:get_action, response.to_json, :namespace => 'socket')
  end

  # Retrieves the most recent canvas state stored in the database as well as any actions that have been done
  # since that canvas state was stored to send to a newly connected client.
  def send_init_img(test_message = nil)
    if !test_message.nil?
      message = test_message
    end
    canvas_id = message.to_i
    bitmap_record = Bitmap.getBitmap(canvas_id)
    if bitmap_record.nil?
      bitmap = -1
      actions = -1
    else
      bitmap = bitmap_record['bitmap']
      timestamp = bitmap_record['latest_action_timestamp']
      actions = Action.getActions(canvas_id, timestamp)
      puts timestamp
    end
    response = {bitmap: bitmap, actions: actions}.to_json
    if !test_message.nil?
      return response
    end
    send_message :get_init_img, response, :namespace => 'socket'
  end

  # Stores an updated bitmap in the database according to the current state of the canvas a client is drawing on.
  # Broadcasts to all clients so that additional bitmaps with almost the exact same state will not be sent. Finally,
  # calls the cleanUp method to delete old data from the database.
  def get_bitmap(test_message = nil)
    if !test_message.nil?
      message = test_message
    end
    message_json = JSON.parse(message)
    bitmap = message_json['bitmap']
    timestamp = message_json['timestamp']
    canvas_id = message_json['canvasID']
    Bitmap.storeBitmap(bitmap, timestamp, canvas_id)
    WebsocketRails[canvas_id.to_s].trigger(:sent_bitmap, '', :namespace => 'socket')
    BackgroundController.cleanUp(canvas_id, 3)
  end
end
