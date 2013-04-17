CanvUs::Application.routes.draw do
  root :to => 'page#canvus'

	match 'testDraw' => 'page#test_draw'
	match 'draw' => 'page#draw'
	match 'draw2' => 'page#draw2'
	match 'canvus' => 'page#canvus'
	match 'canvases' => 'page#canvases'
end
