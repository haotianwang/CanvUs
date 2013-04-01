require 'test_helper'

class ActionTest < ActiveSupport::TestCase
  
  # Empties the test databases and adds some test data.
  def setup
    Action.destroy_all
    Bitmap.destroy_all
    Action.create(action: 'action_0', canvas_id: 0)
    Action.create(action: 'action_1', canvas_id: 0)
    Action.create(action: 'action_2', canvas_id: 0)
    Action.create(action: 'action_3', canvas_id: 1)
    Action.create(action: 'action_4', canvas_id: 1)
  end

  def testStoreEmptyAction
    numActions = Action.all.count
    Action.storeAction('', 2)
    assert_equal(numActions, Action.all.count, "Empty action was stored")
  end

  def testStoreValidAction
    numActions = Action.all.count
    Action.storeAction('action_5', 2)
    assert_equal(numActions+1, Action.all.count, "Valid action was not stored")
    Action.last.destroy
  end

  # Tests that getting actions with a particular canvas_id before a bitmap with that same 
  # canvas_id has been stored. In this case, all the actions with that canvas_id should
  # be returned.
  def testGetActionsNoBitmap
    numActions = Action.where('canvas_id = 1').count
    numActionsGot = Action.getActions(1, DateTime.new(1992, 4, 11)).split(', ').count
    assert_equal(numActions, numActionsGot, "Incorrect number of actions retrieved")
  end

  # Tests that getting actions with a particular canvas_id after a bitmap with that same
  # canvas_id has been stored. In this case, all the actions stored prior to the bitmap
  # being stored should not be returned.
  def testGetActionsWithBitmap
    Bitmap.create(bitmap: 'bitmap', canvas_id: 0)
    Action.create(action: 'action_5', canvas_id: 0)
    numActionsGot = Action.getActions(0, Bitmap.last[:created_at]).split(', ').count
    assert_equal(1, numActionsGot, "Incorrect number of actions retrieved")
    Bitmap.last.destroy
    Action.last.destroy
  end

  # Empties the test databases once again.
  def teardown
    Action.destroy_all
    Bitmap.destroy_all
  end
end
