class User < ActiveRecord::Base
  attr_accessible :cookie, :password, :username

  # The first iteration will not include a user system.
end