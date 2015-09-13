FROM    centos:centos6

# Install Node.js and npm
RUN     yum install -y epel-release vim net-tools

# Install Node.js and npm
RUN     yum install -y npm

# Bundle app source
COPY . /src
# Install app dependencies
RUN cd /src; npm install

ENTRYPOINT ["node", "/src/simple_word_count.js"]

CMD []
