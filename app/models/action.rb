class Action < ActiveRecord::Base
  attr_accessible :action, :canvas_id

  validates :action, :canvas_id, presence: true

  # Stores an action done on a particular canvas.
  def self.storeAction(action, canvasID)
    Action.create(action: action, canvas_id: canvasID)
  end

  # Gets all the actions for a particular canvas that have been done after the
  # canvas' state was last stored, i.e. if storeBitmap('bitmap', 0) was called
  # at time t, get all actions with canvasID == 0 and timestamp > t.
  def self.getActions(canvasID, timestamp)
    # latestBitmapTimestamp = Bitmap.connection.execute("SELECT B.created_at
    #                                                    FROM Bitmaps B
    #                                                    WHERE B.canvas_id = #{canvasID}
    #                                                    ORDER BY B.created_at DESC
    #                                                    LIMIT 1")
    # latestBitmapTimestamp = Bitmap.where("canvas_id = ?", canvasID).order("created_at DESC").limit(1)
    # if latestBitmapTimestamp.count == 0
      # If no bitmap has been stored for a particular canvas, then all the actions
      # done on that canvas will be needed. An arbitrary time that is guaranteed to
      # be less than any created_at timestamp for all actions is used.
      # latestBitmapTimestamp = DateTime.new(1992, 3, 19)
    # else
      # Since the query returns a list of hashes, return the 'latest_action_timestamp'
      # field of the one entry in the query result.
      # latestBitmapTimestamp = latestBitmapTimestamp[0][:created_at]
    # end
    # actionList = Action.connection.execute("SELECT A.action, A.created_at
    #                                        FROM Actions A
    #                                        WHERE A.canvas_id = #{canvasID}
    #                                        ORDER BY A.created_at ASC")
    actions = Action.select("action, created_at").where("canvas_id = ?", canvasID).order("created_at ASC")
    # Keep only the actions that were done after the bitmap was last stored.
    actions = actions.keep_if{|record| record['created_at'] > timestamp}
    actions = actions.map{|record| record['action']} # Return only the action fields.
    return actions.join(', ')
  end
end
