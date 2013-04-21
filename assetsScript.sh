#This script will precompile assets, scp the files to EC2, and then delete the precompiled files
RAILS_ENV=production rake assets:precompile 
scp -i ../../.ssh/cs169.pem -r public/assets/ ubuntu@54.241.5.2:/home/ubuntu/cs169-sp13/CanvUs/public/
RAILS_ENV=production rake assets:clean

