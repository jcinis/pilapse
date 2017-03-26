.PHONY: deploy

MAKEPATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PWD := $(dir $(MAKEPATH))

deploy:
	rsync -az --force --delete --progress -e "ssh -p22" ./ pi@192.168.248.228:/home/pi/bcam

