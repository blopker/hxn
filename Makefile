all: build

prep:
	@rm -rf dist
	@mkdir -p dist/js

build: prep
	@npm run build

watch: prep
	@npm run watch

deploy:
	@rsync -ahvc ./index.html ./dist gouda@blopker.com:public/dev/hxn
