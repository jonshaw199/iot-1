#!/bin/bash

if ! [ -e ../buildFlags.h ]
then
    read -r -p "Decrypt build flags file? (Y/N): " response
    response=${response,,}    # tolower
    if [[ "$response" =~ ^(yes|y)$ ]]
    then
        git clone https://github.com/jonshaw199/crypt.git
        read -p "Enter encryption key: " key
        read -p "Enter initialization vector: " iv
        node crypt/index.js -d . buildFlags.h.encrypted "$key" "$iv"
        rm -rf crypt
        mv buildFlags.h ..
    fi
fi

echo "postCreate.sh complete"
