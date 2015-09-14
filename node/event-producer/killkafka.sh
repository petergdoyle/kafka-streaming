#!/bin/sh

#kill kafka first
for ps in `ps -ef |grep java |egrep 'kafka' |less -S |sed 's/|/ /' | awk '{print $2}'`;
  do kill -9 $ps;
done

#then kill zookeeper
for ps in `ps -ef |grep java |egrep 'zookeep' |less -S |sed 's/|/ /' | awk '{print $2}'`;
  do kill $ps;
done
