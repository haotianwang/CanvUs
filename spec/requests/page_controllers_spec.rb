require 'spec_helper'

describe "PageControllers" do

  describe "draw" do
    it "should have a canvas" do
      visit '/draw'
      page.should have_selector('canvas', :id => 'myCanvas')
    end

    it "should have a color selector" do
      visit '/draw'
      page.should have_selector('input', :id => 'color-selector')
    end
  end

  describe "welcome" do
    it "should have the CanvUs logo" do
      visit '/welcome'
      page.should have_selector('img', :src => 'CanvusLogo.jpg')
    end
  end

  describe "canvus" do
    it "should have create canvas button" do
      visit '/canvus'
      page.should have_selector('input', :id => 'createRoomButton')
    end
  end

  describe "canvases" do
    it "should have the canvases JSON" do
      visit '/canvases'
      page.should have_content('canvases')
    end
  end

  describe "new_canvas" do
    it "should have the new canvas ID JSON" do
      visit '/new_canvas'
      page.should have_content('canvasID')
    end
  end

end
