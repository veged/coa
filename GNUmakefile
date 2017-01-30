BIN = ./node_modules/.bin

.PHONY: all
all:

.PHONY: test
test:
	$(BIN)/mocha

.PHONY: coverage
coverage:
	$(BIN)/nyc --reporter=text --reporter=html $(BIN)/mocha
	@echo
	@echo Open coverage/index.html file in your browser

.PHONY: clean
clean: clean-coverage

.PHONY: clean-coverage
clean-coverage:
	-rm -rf .nyc_output coverage
