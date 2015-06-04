all: build

prep:
	@rm -rf dist
	@mkdir -p dist/js

build: prep
	@npm run build

watch: prep
	@npm run watch

deploy: build
	@rsync -ahvc ./index.html ./css ./dist gouda@blopker.com:public/dev/hxn
