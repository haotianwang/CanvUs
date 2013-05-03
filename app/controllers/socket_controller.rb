require 'json'

class SocketController < WebsocketRails::BaseController

  @@cleanupList = Hash.new
  @@cleanupListMutex = Mutex.new
  @@performCleanupMutex = Mutex.new
  @@cleanupAmount = 3

  def initialize_session
  end
  
  # Stores an action in the database and generates the first Bitmap and Canvas records for a particular canvasID
  # if they do not yet have any records in the database. Afterwards, broadcasts the action to all connected
  # clients.
  def get_action_handler(test_message = nil)
    time = Time.now
    if test_message.nil?
      working_message = message
    else
      working_message = test_message
    end
    message_json = JSON.parse(working_message)
    action = message_json['message']
    canvas_id = message_json['canvasID']
    if Canvas.find(canvas_id).nil?
      return
    end
    timestamp = Action.storeAction(action, canvas_id)
    response = {message: action, timestamp: timestamp}
    WebsocketRails[canvas_id.to_s].trigger(:get_action, response.to_json, :namespace => 'socket')
    print "get_action_handler took ", time-Time.now, "\n"
  end

  # Retrieves the most recent canvas state stored in the database as well as any actions that have been done
  # since that canvas state was stored to send to a newly connected client.
  def send_init_img(test_message = nil)
    puts "sending init img"
    if test_message.nil?
      working_message = message
    else
      working_message = test_message
    end
    canvas_id = working_message.to_i
    bitmap_record = Bitmap.getBitmap(canvas_id)
    if bitmap_record.nil?
      bitmap = -1
      actions = -1
    else
      bitmap = bitmap_record['bitmap']
      timestamp = bitmap_record['latest_action_timestamp']
      actions = Action.getActions(canvas_id, timestamp)
      actionsCacheCopy = Array.new(Action.returnCache())
      puts "sendInitImg: successfully made copy of actionsCache"
      print "cache length: ", actionsCacheCopy.length, "\n"
      print "actions length: ", actions.length, "\n"
      actionsCacheCopy.each do |a|
        if a.canvas_id==canvas_id
          if actions != ""
            actions = actions + ", "
          end
          actions = actions + a.action
        end
      end
      puts "successfully pushed all actions to response message"
    end
    response = {bitmap: bitmap, actions: actions}.to_json
    if !test_message.nil?
      return response
    end
    puts "successfully formatted response into json"
    send_message :get_init_img, response, :namespace => 'socket'
    puts "done sending init img"
  end

  # Stores an updated bitmap in the database according to the current state of the canvas a client is drawing on.
  # Broadcasts to all clients so that additional bitmaps with almost the exact same state will not be sent. Finally,
  # calls the cleanUp method to delete old data from the database.
  def get_bitmap(test_message = nil)
    if test_message.nil?
      working_message = message
    else
      working_message = test_message
    end
    message_json = JSON.parse(working_message)
    bitmap = message_json['bitmap']
    timestamp = message_json['timestamp']
    canvas_id = message_json['canvasID']
    Bitmap.storeBitmap(bitmap, timestamp, canvas_id)
    WebsocketRails[canvas_id.to_s].trigger(:sent_bitmap, '', :namespace => 'socket')
    @@cleanupListMutex.synchronize do
      @@cleanupList[canvas_id] = true
    end
  end

  def self.cleanupAll()
    puts "cleaning up canvases"
    fetchedCleanupList = nil
    @@cleanupListMutex.synchronize do
      fetchedCleanupList = @@cleanupList
      @@cleanupList = Hash.new
    end

    @@performCleanupMutex.synchronize do
      fetchedCleanupList.each_key { |canvas_id|
        BackgroundController.cleanUp(canvas_id, @@cleanupAmount)
        Action.getActions(canvas_id, DateTime.now)
        Bitmap.getBitmap(canvas_id)
        print "cleaned up canvas ", canvas_id, "\n"
      }
    end
  end


end
