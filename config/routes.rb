CanvUs::Application.routes.draw do
  root :to => 'page#canvus'

	match 'draw' => 'page#draw'
	match 'draw2' => 'page#draw2'
	match 'canvus' => 'page#canvus'
	match 'canvases' => 'page#canvases'
  match 'new_canvas' => 'page#new_canvas'
end
