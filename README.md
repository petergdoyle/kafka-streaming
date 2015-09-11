
kafka-streaming
======
**Software Name** Build a streaming data pipeline with kafka and node.js and spring-xd

## Version
* Version 0.0.1

## Pre-Req Installation
* Vagrant
* Virtualbox
* GitBash (for windows users)

## Installation
Pull a vagrant box image down
```
[me@host ~]$ vagrant box add petergdoyle/CentOS-7-x86_64-Minimal-1503-01
```

## Usage
Clone the project repo. This will have everything you need to create a running Development box pre-configured and pre-installed, plus all the project sources, build definitions, etc. 
```
[me@host ~]$ git clone https://github.com/petergdoyle/kafka-streaming.git
...```

Create the Dev box. You should see the virtual machine be created and provisioned and required software installed. And finally some type of success message.
```
$ cd kafka-streaming
[me@host ~]$ vagrant up
...```

Connect to the Dev box. You should
```
[me@host ~]$ vagrant ssh
[vagrant@kafka-streaming ~]$
...```
