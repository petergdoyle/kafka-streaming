#!/bin/sh
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"
echo $1 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $1 provided"

server_id="$1"
docker run --name kafka_server_$server_id -h kafka_server_$server_id --link kafka_zk_0:kafka_zk_0 -d petergdoyle/kafka:2.9 start-kafka-server.sh $server_id
