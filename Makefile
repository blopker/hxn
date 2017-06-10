install:
	@yarn install

start:
	@yarn run watch

deploy:
	@git push dokku master

test:
	@yarn test

clean:
	@rm -rf node_modules

git:
	@git remote add dokku dokku@ssh.kbl.io:hxn
