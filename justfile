@list:
    just -l

site:
    minify --recursive --output publish/ *.html *.js *.css images icons

blog:
    hugo --source blog --destination ../publish/blog --minify

serve:
    pushd publish && python3 -m http.server 1313

all: clean blog site

clean:
    rm -irf publish/*
