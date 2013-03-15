class Action < ActiveRecord::Base
  attr_accessible :action, :canvas_id

  # Stores an action done on a particular canvas.
  def self.storeAction(action, canvasID)
    newAction = Action.new(action: action, canvas_id: canvasID)
    newAction.save
  end

  # Gets all the actions for a particular canvas that have been done after the
  # canvas' state was last stored, i.e. if storeBitmap('bitmap', 0) was called
  # at time t, get all actions with canvasID == 0 and timestamp > t.
  def self.getActions(canvasID)
    latestBitmapTimestamp = Bitmap.connection.execute("SELECT B.latest_action_timestamp
                                              FROM Bitmaps B
                                              WHERE B.canvas_id = #{canvasID}
                                              ORDER BY B.created_at DESC
                                              LIMIT 1")
    if latestBitmapTimestamp.count == 0
      # If no bitmap has been stored for a particular canvas, then all the actions
      # done on that canvas will be needed. An arbitrary time that is guaranteed to
      # be less than any created_at timestamp for all actions is used.
      latestBitmapTimestamp = Date.new(1992, 3, 19).to_datetime.to_s
    else
      # Since the query returns a list of hashes, return the 'latest_action_timestamp'
      # field of the one entry in the query result.
      latestBitmapTimestamp = latestBitmapTimestamp[0]['latest_action_timestamp']
    end
    actionList = Bitmap.connection.execute("SELECT A.action, A.created_at
                                            FROM Actions A
                                            WHERE A.canvas_id = #{canvasID}
                                            ORDER BY A.created_at ASC")
	#puts actionList[0].to_s
    actionList = actionList.map{|action| action}
    #puts "actionList is now " + actionList.to_s
    actionList = actionList.keep_if{|action| action['created_at'] > latestBitmapTimestamp}
    #puts "after keep, actionList is now " + actionList.to_s
    actionList = actionList.map{|action| action['action']} # Return only the action fields.
    #puts "after map, actionList is now " + actionList.to_s
    return actionList.join(', ')
  end

end
