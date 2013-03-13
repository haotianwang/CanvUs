class Action < ActiveRecord::Base
  attr_accessible :action, :canvas_id


  def self.storeAction(action, canvasID)
  	newAction = Action.new(action: action, canvas_id: canvasID)
  	newAction.save
  end

  def self.getActions(canvasID)
  	latestAction = Bitmap.connection.execute("SELECT B.latest_action_timestamp
                                              FROM Bitmap B
                                              WHERE B.canvas_id = #{canvasID}
                                              ORDER BY DESC
                                              LIMIT 1")

    if latestAction.empty?
      latestAction = '0'
    else
      latestAction = latestAction[0]['latest_action_timestamp']
    end

    actionList = Bitmap.connection.execute("SELECT A.action
                                            FROM Action A
                                            WHERE A.canvas_id = #{canvasID} AND
                                                  A.created_at > #{latestAction}
                                            ORDER BY ASC")
    return actionList.map{|action| action['action']}
  end

end
