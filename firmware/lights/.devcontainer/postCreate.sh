if ! [ -e ../buildFlags.h ]
then
    read -p "Decrypt build flags file? (Y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
        sudo apt-get install -y nodejs git
        git clone https://github.com/jonshaw199/crypt.git
        read -p "Enter encryption key: " key
        read -p "Enter initialization vector: " iv
        node crypt/index.js -d . buildFlags.h.encrypted "$key" "$iv"
        rm -rf crypt
        mv buildFlags.h ..
    fi
fi

echo "postCreate.sh complete"
