# wiki.js auto translator

For the [wiki.js](https://github.com/requarks/wiki/) Project this tools is able to auto translate all missing pages from locale `a` to locale `b`.

## How To

Install dependencies
```
pnpm install
```

copy `.env.example` to `.env` and fill in missing keys.

run
```bash
node index.js
```

## Limitations
* Supports only markdown for now
* Links might be translated as well with the current prompt.
* Navigation is neither created nor linked