#!/bin/bash

read -r -p "Decrypt environment variables? (Y/N): " response
response=${response,,} # tolower
if [[ "$response" =~ ^(yes|y)$ ]]
then
    git clone https://github.com/jonshaw199/crypt.git
    read -p "Enter encryption key: " key
    read -p "Enter initialization vector: " iv
    node crypt/index.js -d . .env.encrypted "$key" "$iv"
    rm -rf crypt
fi

echo "Setup complete"
