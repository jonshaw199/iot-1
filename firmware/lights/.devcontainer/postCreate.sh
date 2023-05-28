sudo apt install git

if ! [ -e ../.env ]
then
    read -p "Decrypt files? (Y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        git clone https://github.com/jonshaw199/crypt.git
        read -p "Enter encryption key: " key
        read -p "Enter initialization vector: " iv
        node crypt/index.js -d . platformio.ini.encrypted "$key" "$iv"
        rm -rf crypt
        mv platformio.ini ..
    fi
fi

echo "postCreate.sh complete"
