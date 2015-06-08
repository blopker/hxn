all: build

prep:
	@rm -rf dist
	@mkdir -p dist/js
	@npm install

build: prep
	@npm run build

watch: prep
	@npm run watch

deploy: build
	@rsync -ahvc ./index.html ./css ./dist static@kbl.io:public/dev/hxn
