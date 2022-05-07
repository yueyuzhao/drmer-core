# @drmer/core

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
