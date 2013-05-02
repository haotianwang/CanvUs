require 'rubygems'
require 'rufus/scheduler'  
scheduler = Rufus::Scheduler.start_new
scheduler.every("5s") do
    Action.flushActions()
    ActiveRecord::Base.connection.close
    ActiveRecord::Base.connection_pool.clear_stale_cached_connections!
end