.PHONY: all
all: lib

lib: $(foreach s,$(wildcard src/*.coffee),$(patsubst src/%.coffee,lib/%.js,$s))

lib/%.js: src/%.coffee
	./node_modules/.bin/coffee -cb -o $(@D) $<

.PHONY: test
test: lib
	./node_modules/.bin/vows --spec

.PHONY: watch
watch:
	coffee --watch --bare --output lib src/*.coffee
