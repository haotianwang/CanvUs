require 'test_helper'

class BitmapTest < ActiveSupport::TestCase
  
  # Empties the test Bitmap database and adds some test data.
  def setup
    Bitmap.destroy_all
    Bitmap.create(bitmap: 'bitmap_0', canvas_id: 0)
    Bitmap.create(bitmap: 'bitmap_1', canvas_id: 1)
    Bitmap.create(bitmap: 'bitmap_2', canvas_id: 2)
  end

  # Tests that empty bitmaps, which represent blank canvases, are properly stored.
  def testStoreEmptyBitmap
    numBitmaps = Bitmap.all.count
    Bitmap.storeBitmap('', 3)
    assert_equal(numBitmaps+1, Bitmap.all.count, "Empty bitmap was not stored")
    Bitmap.last.destroy
  end

  # Tests that nonempty bitmaps are properly stored.
  def testStoreNonemptyBitmap
    numBitmaps = Bitmap.all.count
    Bitmap.storeBitmap('bitmap_3', 3)
    assert_equal(numBitmaps+1, Bitmap.all.count, "Nonempty bitmap was not stored")
    Bitmap.last.destroy
  end

  # Tests that a bitmap with a duplicate canvas_id is properly stored.
  def testStoreBitmapDupCanvas
    numBitmaps = Bitmap.all.count
    Bitmap.storeBitmap('bitmap_3', 0)
    assert_equal(numBitmaps+1, Bitmap.all.count, "Bitmap was not stored")
    Bitmap.last.destroy
  end

  # Tests that getting a bitmap with a nonexistent canvas_id will return an empty string,
  # which represents a blank canvas.
  def testGetBitmapFailure
    bitmapGot = Bitmap.getBitmap(3)
    assert(bitmapGot.empty?, "Bitmap incorrectly retrieved")
  end

  # Tests that getBitmap will return only the latest bitmap for a particular canvas_id.
  def testGetBitmap
    Bitmap.create(bitmap: 'bitmap_3', canvas_id: 0)
    bitmapGot = Bitmap.getBitmap(0)
    assert_equal('bitmap_3', bitmapGot[0][:bitmap], "Bitmap incorrectly retrieved")
    Bitmap.last.destroy
  end

  # Empties the test Bitmap database once again.
  def teardown
    Bitmap.destroy_all
  end
end
