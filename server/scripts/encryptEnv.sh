git clone https://github.com/jonshaw199/crypt.git
read -p "Enter encryption key: " key
read -p "Enter initialization vector: " iv
node crypt/index.js -e ../ .env "$key" "$iv"
rm -rf crypt