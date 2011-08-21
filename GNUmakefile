
all: lib

lib: $(foreach s,$(wildcard src/*.coffee),$(patsubst src/%.coffee,lib/%.js,$s))

lib/%.js: src/%.coffee
	coffee -cb -o $(@D) $<
