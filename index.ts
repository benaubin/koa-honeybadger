import { Middleware } from "koa";
import Honeybadger from "honeybadger";

export default function koaHoneybadger({
  config,
}: {
  config: Honeybadger.ConfigureOptions;
}): Middleware & {
  client: Honeybadger.HoneyBadgerInstance;
} {
  let client = Honeybadger.factory(config);

  const middleware: Middleware = async function koaHoneybadger(ctx, next) {
    if (typeof Honeybadger === "undefined") return next();

    ctx.honeybadger = client;

    ctx.notifyHoneybadger = (error, opts) => {
      const { context, session, cgiData } = opts || {
        context: {},
        session: {},
        cgiData: { "node-version": process.version },
      };

      Honeybadger.notify(error, {
        context,
        session,
        headers: ctx.req.headers,
        url: ctx.url,
        cgiData,
      });
    };

    try {
      await next();
    } catch (err) {
      ctx.notifyHoneybadger(err);
      throw err;
    }
  };

  return Object.assign(middleware, { client });
}

declare module "koa" {
  interface ExtendableContext {
    /** The Honeybadger instance */
    honeybadger: Honeybadger.HoneyBadgerInstance;
    notifyHoneybadger(
      error: Error,
      opts?: {
        context: {};
        session: {};
        cgiData: {};
      }
    ): void;
  }
}
