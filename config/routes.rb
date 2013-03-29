CanvUs::Application.routes.draw do
	match 'testDraw' => 'page#test_draw'
	match 'draw' => 'page#draw'
	match 'draw2' => 'page#draw2'
	match 'canvus' => 'page#canvus'
end
