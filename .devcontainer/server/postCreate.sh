sudo apk add npm git
npm i

read -p "Decrypt .env files? (Y/N): " confirm
if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    git clone https://github.com/jonshaw199/crypt.git
    read -p "Enter encryption key: " key
    read -p "Enter initialization vector: " iv
    node crypt/index.js -d .. .env.encrypted "$key" "$iv"
    rm -rf crypt
fi
echo "postCreate.sh complete"