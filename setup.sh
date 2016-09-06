#!/bin/bash
echo 'SESSION_SECRET=YourSessionSecretGoesHere' > .env

# Download secrets.js file. Not found in git
# and should never be in git.
wget --no-check-certificate 'https://drive.google.com/file/d/0By1RZW5XyyDdZzl1TV9uV1pfZms/view?usp=sharing' -O config/secrets.js

# Create .gitignore file if needed
if [ ! -f .gitignore ]; then
    touch .gitignore
fi

# Add .env to the .gitignore file
if [[ ! -n $(grep ".env" ".gitignore") ]]
then
    echo '.env' >> .gitignore
fi

# Add secrets.js to .gitignore file
if [[ ! -n $(grep "config/secrets.js" ".gitignore") ]]
then
    echo 'config/secrets.js' >> .gitignore
fi
