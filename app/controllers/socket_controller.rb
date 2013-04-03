require 'json'

class SocketController < WebsocketRails::BaseController

  # Initializes action_count to 0, which will be incremented each time an action is received from a client.
  def initialize_session
  end
  
  # Stores an action in the database and increments the action count, which will keep track of how many actions
  # have been done since the canvas state was last saved. Afterwards, broadcasts the action to all connected
  # clients.
  def get_action_handler
    message_json = JSON.parse(message)
    action = message_json['message']
    canvas_id = message_json['canvasID']
    timestamp = Action.storeAction(action, canvas_id)
    if Bitmap.where("canvas_id = ?", canvas_id).first.nil?
      controller_store[canvas_id] = true
      bitmap_id = Bitmap.storeBitmap('', timestamp, canvas_id)
      Canvas.createCanvas(canvas_id, bitmap_id)
    end
    response = JSON.parse(action)
    response['timestamp'] = timestamp
    WebsocketRails[canvas_id.to_s].trigger(:get_action, response.to_json, :namespace => 'socket')
  end

  # Retrieves the most recent canvas state stored in the database as well as any actions that have been done
  # since that canvas state was stored to send to a newly connected client.
  def send_init_img
    canvas_id = message.to_i
    bitmap_record = Bitmap.getBitmap(canvas_id)
    if bitmap_record.nil?
      bitmap = ''
      timestamp = DateTime.new(1992, 3, 19)
    else
      bitmap = bitmap_record['bitmap']
      timestamp = bitmap_record['latest_action_timestamp']
    end
    actions = Action.getActions(canvas_id, timestamp)
    puts actions
    puts "Those are the actions.."
    response = {bitmap: bitmap, actions: actions}.to_json
    send_message :get_init_img, response, :namespace => 'socket'
  end

  def get_bitmap
    puts "Hey, Hoetrain. Stop doubting me."
    message_json = JSON.parse(message)
    bitmap = message_json['bitmap']
    timestamp = message_json['timestamp']
    canvas_id = message_json['canvasID']
    Bitmap.storeBitmap(bitmap, timestamp, canvas_id)
    WebsocketRails[canvas_id.to_s].trigger(:sent_bitmap, '', :namespace => 'socket')
    puts "It looks like I broadcasted.."
    BackgroundController.cleanUp(canvas_id, 3)
  end
end
