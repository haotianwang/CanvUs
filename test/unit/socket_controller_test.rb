require 'test_helper'

class SocketTest < ActiveSupport::TestCase
  
  # Empties the test databases and adds some test data.
  def setup
    Action.destroy_all
    Bitmap.destroy_all
    Canvas.destroy_all

    Action.create(action: 'action_0', canvas_id: 1)
    Bitmap.create(bitmap: 'bitmap_0', canvas_id: 1)
    Bitmap.create(bitmap: 'bitmap_1', latest_action_timestamp: DateTime.new(1990, 6, 25), canvas_id: 1)
    Canvas.createCanvas()
  end

  # test the socket controller method get_action_handler when the given canvasID is not an actual Canvas record id
  def testGetActionHandlerInvalidCanvasID
    testSocket = SocketController.new
    # create a test JSON with a nonexistent canvasID
    testJSON = {message: 'action_1', canvasID: 0}.to_json
    preHandlerCount = Action.where("canvas_id = ?", 0).count
    assert_raise(ActiveRecord::RecordNotFound, "a nonexistent canvas was found"){
      testSocket.get_action_handler(testJSON)}
    postHandlerCount = Action.where("canvas_id = ?", 0).count
    # make sure that the database was unaffected when the canvasID is invalid
    assert_equal(preHandlerCount, postHandlerCount, "getActionHandler incorrectly modified the database")
  end

  # test the socket controller method get_action_handler when the given canvasID is the id of a Canvas record
  def testGetActionHandlerValidCanvasID
    testSocket = SocketController.new
    # create a test JSON so we're able to call and check
    testJSON = {message: 'action_1', canvasID: 1}.to_json
    preHandlerCount = Action.where("canvas_id = ?", 1).count
    testSocket.get_action_handler(testJSON)
    postHandlerCount = Action.where("canvas_id = ?", 1).count
    # make sure an action was saved to the database
    assert_equal(preHandlerCount+1, postHandlerCount, "getActionHandler failed to save an action")
  end

  # test the socket controller method get_bitmap when the given canvasID is the id of a Canvas record
  def testGetBitmapValidCanvasID
    testSocket = SocketController.new
    testTime = DateTime.new(1958, 10, 25)
    testJSON = {bitmap: 'bitmap_2', timestamp: testTime, canvasID: 1}.to_json
    preGetCount = Bitmap.where("canvas_id = ?", 1).count
    testSocket.get_bitmap(testJSON)
    postGetCount = Bitmap.where("canvas_id = ?", 1).count
    newestBitmap = Bitmap.where("canvas_id = ?", 1).order("created_at DESC").first
    assert_equal(preGetCount+1, postGetCount, "getBitmap failed to save a bitmap")
    assert_equal(newestBitmap.bitmap, 'bitmap_2', "incorrect bitmap saved")
  end

  # test the socket controller method send_init_img when the given canvasID is not an actual Canvas record id
  def testSendInitImgInvalidCanvasID
    testSocket = SocketController.new
    initImgInfoJSON = testSocket.send_init_img('0')
    initImgInfo = JSON.parse(initImgInfoJSON)
    assert_equal(-1, initImgInfo['bitmap'], "bitmap field is incorrectly filled in for nonexistent canvas")
    assert_equal(-1, initImgInfo['actions'], "actions field is incorrectly filled in for nonexistent canvas")
  end

  # test the socket controller method send_init_img when the given canvasID is the id of a Canvas record
  def testSendInitImgValidCanvasID
    testSocket = SocketController.new
    newestBitmap = Bitmap.where("canvas_id = ?", 1).order("created_at DESC").first
    initImgInfoJSON = testSocket.send_init_img('1')
    initImgInfo = JSON.parse(initImgInfoJSON)
    assert_equal(newestBitmap.bitmap, initImgInfo['bitmap'], "bitmap sent is not the most recent bitmap")
    assert_equal('action_0', initImgInfo['actions'], "incorrect actions returned from send_init_img")
  end

  def teardown
    Action.destroy_all
    Bitmap.destroy_all
    Canvas.destroy_all
  end
end
