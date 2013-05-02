require 'rubygems'
require 'rufus/scheduler'  
scheduler = Rufus::Scheduler.start_new
#scheduler.every("60s") do
#    Action.repeatFlush()
#end