CanvUs::Application.routes.draw do
	match 'testDraw' => 'page#test_draw'
	match 'draw' => 'page#draw'
	match 'draw2' => 'page#draw2'
	match 'welcome' => 'page#welcome'
	match 'canvus' => 'page#canvus'
	match 'canvases' => 'page#canvases'
end
