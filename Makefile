install:
	@npm install

start:
	@npm run watch

deploy:
	@git push dokku master

test:
	@npm test

clean:
	@rm -rf node_modules

git:
	@git remote add dokku dokku@ssh.kbl.io:hxn
