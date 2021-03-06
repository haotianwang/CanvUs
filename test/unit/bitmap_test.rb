require 'test_helper'

class BitmapTest < ActiveSupport::TestCase
  
  # Empties the test Bitmap database and adds some test data.
  def setup
    Bitmap.destroy_all
    Bitmap.create(bitmap: 'bitmap_0', canvas_id: 0)
    Bitmap.create(bitmap: 'bitmap_1', canvas_id: 1)
    Bitmap.create(bitmap: 'bitmap_2', canvas_id: 2)
  end

  # Test that the correct validations are enforced on Bitmap record creation.
  def testValidations
    numBitmaps = Bitmap.all.count
    Bitmap.create()
    assert_equal(numBitmaps, Bitmap.all.count, "A Bitmap record without a canvas_id was incorrectly stored")
  end

  # Tests that empty bitmaps, which represent blank canvases, are properly stored.
  def testStoreEmptyBitmap
    numBitmaps = Bitmap.all.count
    Bitmap.storeBitmap('', DateTime.new(1991, 9, 19), 3)
    assert_equal(numBitmaps+1, Bitmap.all.count, "Empty bitmap was not stored")
    Bitmap.last.destroy
  end

  # Tests that nonempty bitmaps are properly stored.
  def testStoreNonemptyBitmap
    numBitmaps = Bitmap.all.count
    Bitmap.storeBitmap('bitmap_3', DateTime.new(1990, 4, 19), 3)
    assert_equal(numBitmaps+1, Bitmap.all.count, "Nonempty bitmap was not stored")
    Bitmap.last.destroy
  end

  # Tests that a bitmap with a duplicate canvas_id is properly stored.
  def testStoreBitmapDupCanvas
    numBitmaps = Bitmap.all.count
    Bitmap.storeBitmap('bitmap_3', DateTime.new(1992, 5, 19), 0)
    assert_equal(numBitmaps+1, Bitmap.all.count, "Bitmap was not stored")
    Bitmap.last.destroy
  end

  # Tests that getting a bitmap with a nonexistent canvas_id will return an empty string,
  # which represents a blank canvas.
  def testGetBitmapFailure
    bitmapGot = Bitmap.getBitmap(3)
    assert(bitmapGot.nil?, "Bitmap incorrectly retrieved")
  end

  # Tests that getBitmap will return only the latest bitmap for a particular canvas_id.
  def testGetBitmap
    Bitmap.create(bitmap: 'bitmap_3', canvas_id: 0)
    bitmapGot = Bitmap.getBitmap(0)
    assert_equal('bitmap_3', bitmapGot[:bitmap], "Bitmap incorrectly retrieved")
    Bitmap.last.destroy
  end

  # Tests the deletion of the oldest bitmap
  def testDeleteBitmap
    Bitmap.create(bitmap: 'bitmap_4', canvas_id: 5)
    Bitmap.create(bitmap: 'bitmap_5', canvas_id: 5)
    Bitmap.create(bitmap: 'bitmap_6', canvas_id: 5)
    Bitmap.create(bitmap: 'bitmap_7', canvas_id: 5)

    oldestBitmap = Bitmap.where("canvas_id = ?", 5).order("created_at ASC").first
    deletedBitmap = Bitmap.deleteBitmap(5)
    assert_equal(oldestBitmap, deletedBitmap, "Wrong bitmap deleted; was not the oldest one")
  end

  # Empties the test Bitmap database once again.
  def teardown
    Bitmap.destroy_all
  end
end
