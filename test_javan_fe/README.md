![alt text](https://averoa.com/averoa.png)
# AveroaJS

'Laravel Like' Boilerplate built on express


## Installation

Install averoajs with npm

```bash
  git clone https://github.com/budiherma1/averoajs.git
  cd averoajs
  cp .env.example .env
```



```bash
  npm install
  npm run dev
```
## CREATE CRUD RESTAPI JUST 1 COMMAND
AveroaJS provide ready to use crud pattern restapi by running this command:

```bash
  node averoa make:crud sample_db_table,another_db_table,db_table -init
```
sample_db_table,another_db_table,db_table are list of table that used for the crud
`- init` is flag that indicate it run for the first time
if there are another table that need to be added, just exclude `-init` on the command

contoller, model, routes, migration, and seeder are generated by the command.
so you maybe just edit the model then run migration, seed, then npm run dev.

## THE CRUD SPECIFICATION
the crud routes generated by above command can be like this
```bash
router.crud('Users', 'users', () => {
  router.get('/', 'UsersController@findAll');
  router.get('/:id', 'UsersController@findOne');
  router.post('/', 'UsersController@create');
  router.put('/:id', 'UsersController@update');
  router.delete('/:id', 'UsersController@delete');
});
```
**Get all data**
```bash
router.get('/', 'UsersController@findAll');
```
this endpoint is to get all data of the table. You can use query parameter below to filter the result:

```bash
:eq (=)
:neq (!=)
:lt (<)
:lte (<=)
:gt (>)
:gte (>=)
:like (like case sensitive)
:ilike (like case insensitive)
:in (in)
:notNull (not null)
:isNull (is null)
:btwn (between)

columnName (all column name that exist on the table)
orderBy
orderByDesc
groupBy
limit
offset
$relations (relation name set on module, see on objectionjs documentation)

sample:
user_id:eq=44&orderBy=created_at&limit=20
```


## Directory Structure

```bash
  |-- averoaJS
    |-- .env.example
    |-- .gitignore
    |-- averoa.js
    |-- README.md
    |-- package-lock.json
    |-- package.json
    |-- server.js
    |-- app
    |   |-- Console
    |   |   |-- Command
    |   |-- Controllers
    |   |-- Helpers
    |   |-- Jobs
    |   |-- Middleware
    |   |-- Models
    |   |-- Providers
    |   |-- Repositories
    |   |-- Strategies
    |-- config
    |-- database
    |   |-- migrations
    |   |-- seeds
    |-- public
    |-- resources
    |   |-- assets
    |   |   |-- js
    |   |   |   |-- components
    |   |   |-- sass
    |   |-- lang
    |   |-- views
    |-- routes
    |   |-- api.js
    |   |-- web.js
    |-- storages
    |   |-- logs
    |   |   |-- access.log
    |   |   |-- averoa.log
    |   |   |-- error.log
    |   |-- tmp
    |   |-- upload
    |-- tests

```

## Migration and Seeder
Before running migration/seeder command, Please install knex CLI globally
```bash
  npm install knex -g
```

Creating migration file :
```bash
  npm run migrate:make migration_name
```

Executing migration :
```bash
  npm run migrate:up
```

Taken down migration :
```bash
  npm run migrate:down
```

Creating seeder file :
```bash
  npm run seed:make seeder_name
```

Executing seeder :
```bash
  npm run seed:run
```

## `app` Directory

### Console (comingsoon)
It contains CLI for this project. 

### Controllers
Logic of this project lived here.\
Controller can be created using command :

```bash
  node averoa make:controller NameController
```

### Helpers
Your custom helpers/utils can be placed here.\
Helper can be created using command :

```bash
  node averoa make:helper YourHelper
```

Import:
```bash
  import { YourHelper } from '@averoa/helpers'
```

### Jobs
This directory contain all jobs that ready to use.\
Job can be created using command :

```bash
  node averoa make:job SampleJob
```

Import:
```bash
  import { SampleJob } from '@averoa/jobs'
```

### Middleware
This directory contain all middleware for this project.\
Middleware can be created using command :

```bash
  node averoa make:middleware TestMiddleware
```

### Models
Directory for models.\
Models can be created using command :

```bash
  node averoa make:model Users
```
Import:
```bash
  import { Users } from '@averoa/models'
```

Sample Usage:
```bash
import { Users } from '@averoa/models'

  class HomeController {
  
  async getUsers(req, res) {
		let users = await Users.query();
		res.send(users);
	}
  }
```
Or using query builder :
```bash
import { DB } from '@averoa/utilities'

  class HomeController {
  
  async getUsers(req, res) {
		let users = await DB.select().from('users');
		res.send(data);
	}
  }
```
We use [ObjectionJS](https://vincit.github.io/objection.js/guide/relations.html) as the ORM and [Knex](http://knexjs.org/guide/query-builder.html) for query builder.

### Providers
All services provider for this project.\
Here are several provider that already created:

**AppProvider**

You can set your additional module here. below is sample setup of swagger using this provider :

```bash
import swaggerUi from'swagger-ui-express';
import swaggerDocument from './swagger.json';

class AppProvider {

beginning(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

}
```
this class have 2 method, beginning and end.

Beginning means, all setup will be executed before another module have been init/setup.

Then for end method, all setup under this method will be executed after another module have been init/setup.

**MiddlewareProvider**

This provider is for set global middleware for all route. Here is example if you want to set multer upload middleware as global for all routes:

UploadImageMiddleware.js

```bash
import multer from 'multer';

class UploadImageMiddleware {
	handle(req, res, next) {
		const upload = multer({ dest: './storages/upload/' })
		upload.single('image')(req, res, next);
	}
}

export default new UploadImageMiddleware
```

MiddlewareProvider.js

```bash
import UploadImageMiddleware from "../Middleware/UploadImageMiddleware.js";
class MiddlewareProvider {
	beginning() {
		return [
        UploadImagesMiddleware,
		]
	}
}
```
Same as AppProvider, this class have 2 method, beginning and end.

**ViewProvider**

This provider is to register global variable for view. all global variable can be set on method global. below is the example :

```bash
class ViewProvider {
	// Global variable for view
	global() {
		return {
			testVariable: 'this is global variable',
			sayHello: (value='') => {
				return `Hai ${value}, Greeting from ViewProvider`
			},
			menu: [
				{
				  url: '/',
				  text: 'Home',
				},
				{
				  url: '/about',
				  text: 'About',
				},
				{
				  url: '/contact',
				  text: 'Contact',
				},
			  ]
		}
	}
}
```
For now, this provider only have one method, but maybe there is some additional method soon.

### Repositories
If you have custom, long or complicated query, it can be placed here.\
Repository can be created using command :

```bash
  node averoa make:repository UsersRepository
```

Import:
```bash
  import { UsersRepository } from '@averoa/repositories'
```

### Strategies
This directory is to set all passport strategies.\
Strategy can be created using command :

```bash
  node averoa make:strategy JwtStrategy
```

Sample Usage:

JwtStrategy.js

```bash
  import passport from 'passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
const opts = {}
import { Users } from '@averoa/models';

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

class JwtStrategy {
	config() {
		passport.use(new Strategy(opts, async function (jwt_payload, done) {
			const users = await Users.query().findById(jwt_payload.id);
			if (users) {
				return done(null, users);
			} else {
				return done(null, false);
			}
		}));
	}

	authenticate(req, res, next) {
		passport.authenticate('jwt', { session: false }, function (err, user, info) {
			if (user) {
				return next();
			} else {
				return res.send('you are forbidden to access this route');
			}
		});
	}
}

export default new JwtStrategy;
```

GoogleAuthMiddleware.js

```bash
import { JwtStrategy } from '../Strategies/index.js';

class AuthMiddleware {
	handle(req, res, next) {
		JwtStrategy.authenticate(req, res, next)
	}
}

export default new AuthMiddleware
```

Strategy should have 2 method, config and authenticate. 

config is to set all configuration of the strategy, then authenticate is for validation on the middleware.


## `config` Directory
this directory is to setup configuration of : database, fetch(axios), mail, and queue.

## `database` Directory
this directory contain migration and seeder file

## `public` Directory
it contain file that can be accessed public, like image, css, js etc.

## `resources` Directory
this directory have assets, lang and views.

**assets** and **lang** will be coming soon.

**views** directory is to host all view template. We use edge as the template engine. You can see [here](https://docs.adonisjs.com/guides/views/templating-syntax) for complete usage.

## `routes` Directory
this directory have two files.

**web.js** is routes for web/ fullstack. the path is `/`

**api.js** is routes for restapi. the path is `/api`

Usage:

```bash
import Router from '@averoa/routes';

const router = Router();
// for another sample, Please check : https://www.npmjs.com/package/@averoa/ave-route
router.get('/', 'SampleController@sampleMethodView');
router.get('/users', 'SampleController@sampleMethodModel');

export default router.router;
```

For another pattern, Please check standalone module (ave-route) : https://www.npmjs.com/package/@averoa/ave-route

## `storages` Directory
it have 3 directory.

**logs** is to store log from util `Log` and from access and error log;

**tmp** and **upload** is to store temporary and file that uploaded in this server.

## `test` Directory
this directory is for unit testing. this test is using jest, Please see [here](https://jestjs.io/docs/getting-started) for complete usage

## Utilities
this project have some built-in utils.

### DB
this util use knexjs. the config can be set on `./config/database.js`

sample usage:

```bash
import { DB } from '@averoa/utilities';

class SampleClass {
	sample(req, res, next) {
		let users = await DB.select().from('users');
		res.send(users);
	}
}

export default new SampleClass
```

### Fetch

this util use axios. the config can be set on `./config/fetch.js`

sample usage:

```bash
import { Fetch } from '@averoa/utilities';

class SampleClass {
	sample(req, res, next) {
		let data = await Fetch.get('/user/12345')
		res.send(data);
	}
}

export default new SampleClass
```

### Log

this util use winston. log file can bee seen on `./storages/logs/averoa.log`

sample usage:

```bash
import { Log } from '@averoa/utilities';

class SampleClass {
	sample(req, res, next) {
		Log.info('test Log info');
		Log.warn('test Log warn');
		res.send('hello');
	}
}

export default new SampleClass
```
log severity :

```bash
// error: 0,
// warn: 1,
// info: 2,
// http: 3,
// verbose: 4,
// debug: 5,
// silly: 6
```

### Mail
this util use nodemailer. the config can be set on `./config/mail.js`

sample usage:

```bash
import { Mail } from '@averoa/utilities';

class SampleClass {
	sample(req, res, next) {
		await Mail.init()
			.from('info@averoa.com')
			.to('customer@mail.com')
			.subject('Welcome to Averoa')
			.html('email', { name: 'Averoa' }) // use template view
            // .html('<h1>Hellow</h1>') // use plain html
			// .queue('Email Channel') // enable this if this email will be sent to queue
			.text('text of this email')
			.send();

		res.send('done');
	}
}

export default new SampleClass
```


### Queue

this util use amqp. the config can be set on `./config/queue.js`

sample usage:

```bash
import { Queue } from '@averoa/utilities';

class SampleClass {
	sample(req, res, next) {
		Queue('test channel', { name: 'Averoa', version: "1.0.0" });
		res.send('done');
	}
}

export default new SampleClass
```

### Validator

this util use validator. see [here](https://www.npmjs.com/package/validator) for the complete usage

Import:

```bash
import { Validator } from '@averoa/utilities';
```

## Authors

- [@budiherma1](https://www.github.com/budiherma1)

## License

[MIT](https://choosealicense.com/licenses/mit/)