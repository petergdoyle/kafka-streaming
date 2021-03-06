


**lorem-ipsum** produce a file of lorem-ipsum content

General Usage: produce a 1Mb lorem-ipsum file using the lorem-ipsum node module. By default, lorem-ipsum adds a blank line between paragraphs, this is removed with the sed filter.
```console
$ npm install lorem-ipsum --global
$ lorem-ipsum 3000 paragraphs |sed '/^\s*$/d' > lorem-ipsum-1Mb.out
```
Produce a gzip'd lorem-ipsum file using the lorem-ipsum node module.
```console
$ npm install lorem-ipsum --global
$ lorem-ipsum 3000 paragraphs |sed '/^\s*$/d' |gzip > lorem-ipsum-1Mb.gz
```

Produce lorem-ipsum content and insert a line number at the beginning of each line to be used as a reference
```console
$ lorem-ipsum 3 paragraphs |sed '/^\s*$/d' |awk '{printf("%010d %s\n", NR, $0)}'
```

Docker Usage: produce a 1Mb lorem-ipsum file using a Docker container
```console
$ docker build -t node/lorem-ipsum .
$ docker run -it --rm --name lorem-ipsum node/lorem-ipsum 3000 paragraphs |sed '/^\s*$/d' > lorem-ipsum-1Mb.out
```
