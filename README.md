# koa-honeybadger

Koa + Honeybadger.

```
$ npm i --save koa-honeybadger
$ yarn add koa-honeybadger
```

```js
import Koa from "koa";
import koaHoneybadger from "koa-honeybadger";

const app = new Koa();
app.use(
  koaHoneybadger({
    config: {
      apiKey: "YOUR_API_KEY"
    },
  })
);
```
