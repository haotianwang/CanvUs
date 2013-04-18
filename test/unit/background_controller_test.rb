require 'test_helper'

class BackgroundTest < ActiveSupport::TestCase
  
  # Empties the test databases and adds some test data.
  def setup
    Action.destroy_all
    Bitmap.destroy_all
    Action.create(action: 'action_0', canvas_id: 0)
    action1 = Action.create(action: 'action_1', canvas_id: 0)
    Action.create(action: 'action_2', canvas_id: 0)
    Action.create(action: 'action_3', canvas_id: 1)
    Action.create(action: 'action_4', canvas_id: 1)

    Bitmap.create(bitmap: 'bitmap_0', canvas_id: 0, latest_action_timestamp: action1[:created_at])
    Bitmap.create(bitmap: 'bitmap_1', canvas_id: 0, latest_action_timestamp: action1[:created_at])
  end

  def testCleanUp
    preCleanUpBitmapCount = Bitmap.where("canvas_id = ?", 0).count
    preCleanUpActionCount = Action.where("canvas_id = ?",0).count
    BackgroundController.cleanUp(0,3)
    cleanUpBitmapCount1 = Bitmap.where("canvas_id = ?", 0).count
    cleanUpActionCount1 = Action.where("canvas_id = ?",0).count
    assert_equal(preCleanUpBitmapCount, cleanUpBitmapCount1, "cleanUp unnecessarily deleted bitmap; less than numKeep in table")
    assert_equal(preCleanUpActionCount, cleanUpActionCount1, "cleanUp unnecessarily deleted action; less than numKeep in table")

    Bitmap.create(bitmap: 'bitmap_2', canvas_id: 0)
    BackgroundController.cleanUp(0,3)
    cleanUpBitmapCount2 = Bitmap.where("canvas_id = ?", 0).count
    cleanUpActionCount2 = Action.where("canvas_id = ?",0).count
    assert_equal(preCleanUpBitmapCount+1, cleanUpBitmapCount2, "cleanUp unnecessarily deleted bitmap; exactly numKeep in table")
    assert_equal(preCleanUpActionCount, cleanUpActionCount2, "cleanUp unnecessarily deleted action; exactly numKeep in table")

    Bitmap.create(bitmap: 'bitmap_3', canvas_id: 0)
    action2 = Action.where("canvas_id = ?", 0).order("created_at DESC").first
    BackgroundController.cleanUp(0,3)
    cleanUpBitmapCount3 = Bitmap.where("canvas_id = ?", 0).count
    cleanUpActionCount3 = Action.where("canvas_id = ?",0).count
    actionKept = Action.where("canvas_id = ?",0).first
    oldestBitmap = Bitmap.where("bitmap = ?", 'bitmap_0').first
    assert_equal(preCleanUpBitmapCount+1, cleanUpBitmapCount3, "wrong number of bitmaps kept")
    assert_equal(nil, oldestBitmap, "wrong bitmap deleted")
    assert_equal(preCleanUpActionCount-2, cleanUpActionCount3, "wrong number of actions kept")
    assert_equal(action2, actionKept, "wrong action(s) deleted")
  end

  def teardown
    Action.destroy_all
    Bitmap.destroy_all
  end
end