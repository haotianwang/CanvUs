# NOTE: THIS IS FOR THE MAIN CanvUs DIRECTORY
#
#This script:
#	precompiles assets
# 	scps it to EC2 (CanvUs directory)
# 	deletes precompiled assets
#
#This assumes the cs169.pem file is in the .ssh directory
#This assumes you have permission to run rake assets:precompile (sudo if needed)
#This assumes this file has x-permission (execute)
RAILS_ENV=production rake assets:precompile --trace
scp -i ../../.ssh/cs169.pem -r public/assets/ ubuntu@54.241.5.2:/home/ubuntu/cs169-sp13/CanvUs/public/
RAILS_ENV=production rake assets:clean

