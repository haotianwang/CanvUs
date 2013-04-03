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

  # Test that the correct validations are enforced on Action record creation.
  def testValidations
    numActions = Action.all.count
    Action.create(action: 'action_6')
    Action.create(canvas_id: 2)
    assert_equal(numActions, Action.all.count, "Action records with empty fields were incorrectly stored")
  end

  # Test that storeAction actually inserts a record into the database when appropriate, i.e.
  # records that abide by the model's validations.
  def testStoreAction
    numActions = Action.all.count
    Action.storeAction('', 2)
    Action.storeAction('action_5', 2)
    assert_equal(numActions+1, Action.all.count, "Valid action was not stored or invalid action was stored")
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

  # Tests the deletion of actions
  def testDeleteActions
    numActionsGot = Action.getActions(0, DateTime.new(1991, 6, 22)).split(', ').count
    endTime = DateTime.new(2011,1,1)

    a = Action.new(action: 'action_6', canvas_id: 0)
    a.created_at = DateTime.new(2009,8,26)
    a.save

    b = Action.new(action: 'action_7', canvas_id: 0)
    b.created_at = DateTime.new(2010,2,2)
    b.save

    Action.deleteActions(0, endTime)
    newNumActionsGot = Action.getActions(0, DateTime.new(1992, 9, 19)).split(', ').count
    assert_equal(newNumActionsGot, numActionsGot, "Incorrect number of actions deleted")
    Action.last.destroy
  end

  # Empties the test databases once again.
  def teardown
    Action.destroy_all
    Bitmap.destroy_all
  end
end
