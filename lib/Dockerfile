FROM node:latest
RUN git clone https://github.com/Alien-Alfa/WhatsBotAlfa-MD.git /root/ALFA/
WORKDIR /root/ALFA/
RUN yarn global add pm2
RUN npm install
RUN yarn install --ignore-engines --network-concurrency 1
RUN apt -y update && apt -y upgrade && apt -y install ffmpeg git imagemagick python3 graphicsmagick sudo npm yarn curl && curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt install -y nodejs && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && apt -y update && apt -y install yarn && apt autoremove -y && rm -rf /var/lib/apt/lists/*
ENV DEBIAN_FRONTEND=noninteractive
EXPOSE 8000
CMD ["npm", "start"]
