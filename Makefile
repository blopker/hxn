install:
	@npm install

start: install
	@npm start

watch: install
	@npm run watch

deploy:
	@git push dokku master

clean:
	@rm -rf node_modules
