.PHONY: build clean install deploy

MAKEPATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PWD := $(dir $(MAKEPATH))

.DEFAULT_GOAL := build

build:
	npm install
	awk '{ gsub("/opt/pilapse/","$(PWD)"); print $0 }' pilapse.sh > pilapse
	chmod 755 pilapse

clean:
	rm pilapse
	rm -r node_modules

install:
	sudo mv pilapse /etc/init.d/pilapse.sh
	sudo update-rc.d pilapse defaults

deploy:
	rsync -az --force --delete --progress -e "ssh -p22" ./ pi@192.168.248.228:/opt/pilapse
