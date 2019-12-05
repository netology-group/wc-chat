#!/bin/sh

cp -r node_modules/node-emoji/lib/emoji.json ./src/misc/emoji.json.js
echo "export default $(cat ./src/misc/emoji.json.js)" > ./src/misc/emoji.json.js
