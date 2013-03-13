CanvUs::Application.routes.draw do
	match 'testDraw' => 'page#test_draw'
	match 'draw' => 'page#draw'
end
