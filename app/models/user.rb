class User < ActiveRecord::Base
  attr_accessible :cookie, :password, :username


  def self.login(user, password)

  end

  def self.add(user, password)

  end



end
