# @drmer/core

[![CircleCI](https://circleci.com/gh/yueyuzhao/drmer-core/tree/main.svg?style=svg&circle-token=a4c3f82c1b414b6df9be767f82e54174fbd00e31)](https://circleci.com/gh/yueyuzhao/drmer-core/tree/main)

Core library for hybrid application

## Usage
```js
import {Drmer} from "@drmer/core";

const drmer = new Drmer();

drmer.onReady(() => {
  // do someting after drmer is ready
});
// bind the bridge after 500ms
drmer.lazyBindBridge(bridge);
// or you can bind the bridge directly
// drmer.bindBridge(bridge);
```

## Documentation

You can view the generated document here https://drmer-core.vercel.app/

## Development

- Install dependencies `yarn install`
- Build library and types `yarn build`
- Build documentation `yarn build:doc`
