# OpenRA games browser

[![Build Status](https://travis-ci.org/dderevjanik/openra-games.svg?branch=master)](https://travis-ci.org/dderevjanik/openra-games)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Demo: https://dderevjanik.github.io/openra-games/

## Attaching to html

```html
<head>
    <link rel="stylesheet" href="ora-games-browser.css">
</head>
<body>
    <div id="app">
        <!-- Here will be games browser placed -->
    </div>
    <script src="ora-games-browser.js"></script>
    <script>
        gamesBrowser.mount(document.getElementById('app'));
    </script>
</body>
```

you can override default filters by adding second argument to `mount` function. For example, if you want to show custom mods by default,
consider adding `games` property.

```javascript
gamesBrowser.mount(document.getElementById('app'), {
    games: ['sp', 'ura', 'ts', 'ra2']
});
```

Look at [./src/types/TFilter.ts](./src/types/TFilter.ts) to see configuration.

## Development

```
git clone https://github.com/dderevjanik/openra-games
cd openra-games
npm i
npm run dev
./docs/index.html
```

## Building in production mode

To build application in production mode (minified as javascript and css files)

`npm run prod`

Output will be located in `docs/` folder
