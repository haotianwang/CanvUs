class SocketController < WebsocketRails::BaseController
	def initialize_session
	end
	
	def get_action_handler
		send_message :get_action, "got to the get action method of controller", :namespace => 'socket'
	end

	def send_init_img
        puts "test test test test test test before"
		send_message :get_init_img, "got to the init img method of controller", :namespace => 'socket'
		puts "test test test test test test"
	end
end
