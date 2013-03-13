class User < ActiveRecord::Base
  attr_accessible :cookie, :password, :username
end
