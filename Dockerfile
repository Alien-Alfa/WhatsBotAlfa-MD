FROM node:18-slim

WORKDIR /APEX

RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/Alien-Alfa/WhatsBotAlfa-MD.git /APEX

WORKDIR /APEX/WhatsBotAlfa-MD

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
