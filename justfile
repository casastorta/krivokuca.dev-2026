@list:
    just -l

all:
    minify --recursive --output publish/ *.html *.js *.css images icons

clean:
    rm -irf publish/*
