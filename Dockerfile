FROM petergdoyle/kafka:2.9

COPY node /node
COPY scripts /scripts

RUN yum -y install nodejs npm make
RUN npm install lorem-ipsum --global

WORKDIR /node/event-producer
RUN npm install

CMD ["/bin/bash"]
