BIN = ./node_modules/.bin

.PHONY: all
all: lib

lib: $(foreach s,$(wildcard src/*.coffee),$(patsubst src/%.coffee,lib/%.js,$s))

lib-cov: lib
	$(BIN)/istanbul instrument --output lib-cov --no-compact --variable global.__coverage__ lib

lib/%.js: src/%.coffee
	$(BIN)/coffee -cb -o $(@D) $<

.PHONY: test
test: lib
	$(BIN)/mocha

.PHONY: coverage
coverage: lib-cov
	COVER=1 $(BIN)/mocha --reporter mocha-istanbul

.PHONY: watch
watch:
	$(BIN)/coffee --watch --bare --output lib src/*.coffee

.PHONY: clean
clean:
	-rm -rf lib-cov
