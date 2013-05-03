class Action < ActiveRecord::Base
  attr_accessible :action, :canvas_id

  validates :action, :canvas_id, presence: true

  @@actionsCache = []
  @@mutex = Mutex.new

  def self.flushActions()
    length = 0
    @@mutex.synchronize do
      length = @@actionsCache.length
      Action.transaction do
        length.times do |i|
          action = @@actionsCache.delete_at(0)
          action.save
        end
      end
    end
  end

  def self.returnCache()
    return @@actionsCache
  end

  # Stores an action done on a particular canvas.
  def self.storeAction(action, canvasID)
    newAction = Action.new(action: action, canvas_id: canvasID)
    newAction.created_at = DateTime.now
    @@actionsCache.push(newAction)
    if (@@actionsCache.length>1000)
      Action.flushActions()
    end
    return newAction[:created_at]
  end

  # Gets all the actions for a particular canvas that have been done after the
  # canvas' state was last stored by using the given timestamp.
  def self.getActions(canvasID, timestamp)
    actions = Action.select("action, created_at").where("canvas_id = ?", canvasID).order("created_at ASC")
    # Keep only the actions that were done after the bitmap was last stored.
    actions = actions.keep_if{|record| record['created_at'] >= timestamp}
    actions = actions.map{|record| record['action']} # Return only the action fields.
    return actions.join(', ')
  end

  # Deletes all the actions with a given canvasID, with a timestamp before the
  # given timestamp. This method is used for garbage collection.
  def self.deleteActions(canvasID, timestamp)
    start = DateTime.new(2009,06,18)
    time = Time.now
    length = 0
    @@mutex.synchronize do
      Action.transaction do
        timestamp = (timestamp.to_time - 1.second).to_datetime
        actionsToDelete = Action.where(:canvas_id => canvasID, :created_at => start..timestamp)
        length = actionsToDelete.length
        actionsToDelete.each do |action|
          action.destroy
        end
      end
    end
    timeAfter = Time.now
    print "it took ", timeAfter-time," to delete ", length," actions!", "\n"
  end
end
