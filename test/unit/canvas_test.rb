require 'test_helper'

class CanvasTest < ActiveSupport::TestCase

  # Empties the test databases and adds some test data.
  def setup
    Bitmap.destroy_all
    Canvas.destroy_all
    bitmap0 = Bitmap.create(bitmap: 'bitmap_0', canvas_id: 0)
    bitmap1 = Bitmap.create(bitmap: 'bitmap_1', canvas_id: 1)
    bitmap2 = Bitmap.create(bitmap: 'bitmap_2', canvas_id: 2)
    Canvas.create(bitmap_id: bitmap0[:id], user_username: 'King Altruism', active: true)
    Canvas.create(bitmap_id: bitmap1[:id], user_username: 'King Altruism', active: true)
    Canvas.create(bitmap_id: bitmap2[:id], user_username: 'King Altruism', active: true)
  end

  # Test that the correct validations are enforced on Canvas record creation.
  def testCanvasValidations
    numCanvases = Canvas.all.count
    Canvas.create(user_username: 'HaotianWang92', active: true)
    Canvas.create(bitmap_id: 2, active: true)
    assert_equal(numCanvases, Canvas.all.count, "Canvases with empty fields were incorrectly inserted")
  end

  # Test that createCanvas actually inserts a new Canvas record into the database.
  def testCreateCanvas
    numCanvases = Canvas.all.count
    Canvas.createCanvas(1)
    assert_equal(numCanvases+1, Canvas.all.count, "New Canvas was not inserted into the database")
    Canvas.last.destroy
  end

  # Test that setBitmap actually changes the state of a record stored in the database.
  def testSetBitmap
    canvas = Canvas.where("id = ?", 1).first
    originalBitmapID = canvas[:bitmap_id]
    Canvas.setBitmap(canvas[:id], 3)
    canvas = Canvas.where("id = ?", 1).first
    newBitmapID = canvas[:bitmap_id]
    assert_not_equal(Bitmap.where("id = ?", originalBitmapID).first, Bitmap.where("id = ?", newBitmapID).first,
                     "Canvas record's bitmap_id field was not changed")
    canvas[:bitmap_id] = originalBitmapID
    canvas.save
  end

  # Test that setActivity actually changes the state of a record stored in the database.
  def testSetActivity
    canvas = Canvas.where("id = ?", 1).first
    originalActivity = canvas[:active]
    Canvas.setActivity(canvas[:id], !originalActivity)
    canvas = Canvas.where("id = ?", 1).first
    newActivity = canvas[:active]
    assert_not_equal(originalActivity, newActivity, "Canvas record's active field was not changed")
    canvas[:active] = originalActivity
    canvas.save
  end

  # Test that getCanvasIDs retrieves all the Canvas record ids for all active Canvas records in the database.
  def testGetCanvasIDs
    canvasIDs = Canvas.getCanvasIDs()
    assert_equal("1|2|3", canvasIDs, "Canvas ids were not correctly retrieved/output")
    Canvas.create(bitmap_id: 1, user_username: 'mylittlelucas888', active: false)
    assert_equal(canvasIDs, Canvas.getCanvasIDs, "An inactive Canvas record's id was incorrectly retrieved/output")
    Canvas.last.destroy
  end

  # Empties the test databases once again.
  def teardown
    Action.destroy_all
    Canvas.destroy_all
  end
end
