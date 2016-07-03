Expresskit
==========

This is an experimental node rest server library using decorators.
Developers using Java and C# frameworks are familiar with annotations when writing restful services.
`expresskit` is an attempt to bring some of those useful annotations to node rest servers.

**Getting Started**

[Prerequisites](#prerequisites)

[Get Expresskit](#getexpresskit)

[tsconfig](#tsconfig)

[Hello World Demo](#helloworld)

**Expresskit**

[Startup Options](#startupoptions)

[Static Content](#staticcontent)

[Koa](#koa)

**Routing**

[The Basics](route/README.md#thebasics)

[Asynchronous Requests](route/README.md#async)

[Expresskit Response](route/README.md#response)

[Injectables](route/README.md#injectables)

**Middleware**

[Route](middleware/README.md#route)

[Router](middleware/README.md#router)

**Auth** (In the future: Resolutions)

[Authentication not Authorization](auth/README.md#authentication)

[Auth and AuthHandler](auth/README.md#authhandler)

**Rules**

[Validate and Authorize](rule/README.md#validateandauthorize)

[Rule and RuleHandler](rule/README.md#use)

[Combining Rules](rule/README.md#combine)

**DTOs**

[Property Validation](dto/README.md#validation)

[Data Scrubbing](dto/README.md#scrubbing)

<a name="prerequisites"></a>
## Prerequisites

[NPM >3.8.0](https://nodejs.org/en/download/current/)

[Node >6.2.0](https://nodejs.org/en/download/current/)

[Typescript >1.8.0](https://www.npmjs.com/package/typescript)

[ntypescript](https://www.npmjs.com/package/ntypescript)

<a name="getexpresskit"></a>
## Get Expresskit

Using npm to install expresskit in the root of your server application.

```
npm install --save expresskit
```

<a name="tsconfig"></a>
## tsconfig

Because we are using Typescript, you will need a tsconfig.
This should point to your `index.ts` file. `experimentalDecorators`
should be set to **true**. From this point you should model your build
configuration to your working process.

If you don't have a process yet or are indifferent, at `module` to "none"
and `outDir` to "bld". You can build your application by running `ntsc` in
the root directory of your server, and run the generated `index.js` file
in the `bld` directory.

```
ntsc
cd build
node index.js
```

```json
{
    "compilerOptions": {
        "target": "es6",
        "module": "none",
        "moduleResolution": "node",
        "declaration": false,
        "noImplicitAny": true,
        "removeComments": true,
        "noLib": false,
        "outDir": "bld",
        "experimentalDecorators": true
    },
    "files": [
        "index.ts"
    ]
}
```

<a name="helloworld"></a>
## Hello World Demo

The index of your expresskit server will need to import the routers you will be using as well as providing the basic configuration of the server.
In this hello world example, we will have a hello component and router in a `/hello` directory.

```
/
  index.ts
  /hello
    router.ts
```

In our `index.ts` we just need to start the Expresskit and tell it to import the
HelloWorldRouter.

```typescript
import Expresskit from 'expresskit';
import 'hello/router';

Expresskit.start();
```

When an Expresskit server is started, it will default to port `8000`. This can
be changed by adding **Start Options** to the `start` method. This is enough to
start a server, but no routes are defined yet. So we'l create a route that returns
"Hello World". In our `hello/router.ts` we can define a router like any class.

```typescript
export class HelloWorldRouter {}
```

To create a **Route** on the HelloWorldRouter, we need to import `Route` from
`expresskit/route`. This is a decorator we can use to create a route on the express
server.

```typescript
import {Route} from 'expresskit/route';

export class HelloWorldRouter {

  @Route('GET', '/hello')
  public static sayHelloWorld() {
    return 'Hello World';
  }

}
```

Now if we build the server, start it, and go to
`http://localhost:8000/hello`, we will get the response "Hello World".

Want more examples? See the [Expresskit Seed Project](https://github.com/iamchairs/expresskit-seed). Want to learn more about
Expresskit and it's many features? Keep reading!

<a name="startupoptions"></a>
## Startup Options

There are a few configurable properties when you start the server. These options
are application wide properties. To add startup options, just pass a json object
to the `Expresskit.start` method.

```typescript
import Expresskit from 'expresskit';

Expresskit.start({
  ... options go here
});
```

Possible options are-

| Option      | Description                                                                                                                                  | Default    |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------|------------|
| port        | The port the server listens to for incoming requests.                                                                                        | 8000       |
| compression | Adds application-wide compression to responses.                                                                                              | false      |
| timezone    | The default timezone of the application. Sets `process.env.TZ` to this property for convenience.                                             | TZ (GMT 0) |
| staticFiles | An array of files and their URIs to serve statically when requested.                                                                         | []         |
| staticPaths | An array of paths and their URIs to serve statically when requested. All files and child directories of this path will be served statically. | []         |

<a name="staticcontent"></a>
## Static Content

There may be cases (i.e. if your client is bundled with your server) where you'l
want to serve files statically. That is, when a file like `localhost:8000/index.html`
is requested, no route is used to handle that request but the file itself will be sent.
You can set entire directories as static where the files in them and their
child directories can be access directly, or you can set specific files as static.

Both `staticFiles` and `staticPaths` are defined in the same format. Each staticFile
and staticPath entry must have a path as well as the uri used to access that path.
Paths can be relative, so the server can access files/paths in non-child directories.
Paths should be relative to the server's index file.

Take this directory structure example-

```
/
  client/
    assets/
      images/
        fooimage.jpg
    index.html

  server/
    index.ts <-- You Are Here
```

We can use staticFiles to point `/` and `/index.html` to the client index file.
And we can use staticPaths to point `/images` to the client's image assets directory.

```typescript
Expresskit.start({
  staticFiles: [
    {uri: '/', path: '../client/index.html'},
    {uri: '/index.html', path: '../client/index.html'}
  ],
  staticPaths: [
    {uri: '/images', path: '../client/assets/images'}
  ]
});
```

Notice that because the server directory is a sibling of the client directory we need
to move up a directory in our path. With this configuration of static
files and paths, we can request the following urls: 

```
http://localhost:8000/
http://localhost:8000/index.html
http://localhost:8000/images/fooimage.jpg
```

<a name="koa"></a>
## Koa

This branch has experimental Koa support. It was written to handle `koa 1.2` and `koa-router 5.4`
initially but switched at the last moment to `koa 2` and `koa-router 7`. With that said, the code is
in a hackish state at the moment.

Expresskit still comes installed with `express`. To use Koa you will need to install `koa` and
`koa-router`.

```
npm install koa@2 --save
npm install koa-router@7 --save
```

In the `index.ts` file, you can choose Koa by providing the `koa` and `koa-router` packages in
the `start` method. 

The default `express` configuration comes with body parser middlewares. By default, Koa does not.
To add the body parser middleware include it in the `middleware` array in the start options.

```
declare var require: any;

let koa = require('koa');
let koaRouter = require('koa-router');
let koaBodyParser = require('koa-bodyparser');

import Expresskit from 'expresskit';
import {KoaServer} from 'expresskit/server';

Expresskit.start({
  server: new KoaServer(koa, koaRouter),
  middleware: [
   koaBodyParser() 
  ]
});
```

Not a whole lot of testing has been done for Koa. But the unit tests pass- so that's a good
sign.

## Keep Reading

[Routing](route/README.md)

[Middleware](middleware/README.md)

[Auth](auth/README.md)

[Rules](rule/README.md)

[DTOs](dto/README.md)

## More Links

[Expresskit Seed Project](https://github.com/iamchairs/expresskit-seed)

[Github](https://github.com/iamchairs/expresskit)

[Issues](https://github.com/iamchairs/expresskit/issues)

[NPM](https://www.npmjs.com/package/expresskit)

[Twitter](https://twitter.com/micahwllmsn)