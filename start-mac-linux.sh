#!/bin/bash
cd "$(dirname "$0")/backend" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js install nahi hai. Pehle https://nodejs.org se LTS version install karo."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Pehli baar setup ho raha hai, thoda wait karo..."
  npm install --no-audit --no-fund
fi

node server.js
