FROM node:0.10-onbuild

# Bundle app source
COPY . /src
# Install app dependencies
RUN cd /src; npm install

CMD ["node", "/src/simple_word_count.js"]
