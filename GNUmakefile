BIN = ./node_modules/.bin

.PHONY: all
all: lib

lib: $(foreach s,$(wildcard src/*.coffee),$(patsubst src/%.coffee,lib/%.js,$s))

lib/%.js: src/%.coffee
	$(BIN)/coffee -cb -o $(@D) $<

.PHONY: test
test: lib
	$(BIN)/mocha

.PHONY: coverage
coverage:
	$(BIN)/nyc --reporter=text --reporter=html $(BIN)/mocha
	@echo
	@echo Open coverage/index.html file in your browser

.PHONY: watch
watch:
	$(BIN)/coffee --watch --bare --output lib src/*.coffee

.PHONY: clean
clean: clean-coverage

.PHONY: clean-coverage
clean-coverage:
	-rm -rf .nyc_output coverage
