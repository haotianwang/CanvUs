class Action < ActiveRecord::Base
  attr_accessible :action, :canvas_id

  validates :action, :canvas_id, presence: true

  # Stores an action done on a particular canvas.
  def self.storeAction(action, canvasID)
    newAction = Action.create(action: action, canvas_id: canvasID)
    return newAction[:created_at]
  end

  # Gets all the actions for a particular canvas that have been done after the
  # canvas' state was last stored by using the given timestamp.
  def self.getActions(canvasID, timestamp)
    actions = Action.select("action, created_at").where("canvas_id = ?", canvasID).order("created_at ASC")
    # Keep only the actions that were done after the bitmap was last stored.
    actions = actions.keep_if{|record| record['created_at'] > timestamp}
    actions = actions.map{|record| record['action']} # Return only the action fields.
    return actions.join(', ')
  end

  # Deletes all the actions with a given canvasID, with a timestamp before the
  # given timestamp. This method is used for garbage collection.
  def self.deleteActions(canvasID, timestamp)
    start = DateTime.new(2009,06,18)
    Action.where(:canvas_id => canvasID, :created_at => start..timestamp).each do |action|
      action.destroy
    end
  end
end
