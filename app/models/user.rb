class User < ActiveRecord::Base
  attr_accessible :username, :password, :cookie

  # The first iteration will not include a user system.
end
