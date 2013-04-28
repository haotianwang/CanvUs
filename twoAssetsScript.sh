# NOTE: THIS IS FOR THE CanvUs2 DIRECTORY 
#
#This script:
#	precompiles assets
# 	scps it to EC2 (CanvUs2)
# 	deletes precompiled assets
#
#Pass in ssh key with -i /directory/to/cs169.pem. Otherwise...
#This assumes the cs169.pem file is in the .ssh directory
#This assumes you have permission to run rake assets:precompile (sudo if needed)
#This assumes this file has x-permission (execute)

while getopts i: option
do
        case "${option}"
        in
                i) SSHLOC=$OPTARG;;
        esac
done

if [[ "$SSHLOC" == "" || "" != $(cat $SSHLOC 2>&1 | grep "No such file" ) ]]; then
    echo "invalid ssh key location, enter key location with -i path/to/cs169.pem"
    exit
fi

RAILS_ENV=production rake assets:precompile --trace
scp -i ~/.ssh/cs169.pem -r public/assets/ ubuntu@54.241.5.2:/home/ubuntu/cs169-sp13/CanvUs2/CanvUs/public/
RAILS_ENV=production rake assets:clean