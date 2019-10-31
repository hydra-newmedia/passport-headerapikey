# Passport-HeaderAPIKey

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][download-url]

[Passport](http://passportjs.org/) strategy for authenticating with a apikey.

This module lets you authenticate using a apikey in your Node.js
applications which is used to build rest apis. By plugging into Passport, apikey authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-headerapikey

## Usage

#### Configure Strategy

The api key authentication strategy authenticates users using a apikey.
The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user.

```javascipt
    const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy
    
    passport.use(new HeaderAPIKeyStrategy(
      { header: 'Authorization', prefix: 'Api-Key ' },
      false,
      function(apikey, done) {
        User.findOne({ apikey: apikey }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user);
        });
      }
    ));
```
#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'headerapikey'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/api/authenticate', 
      passport.authenticate('headerapikey', { session: false, failureRedirect: '/api/unauthorized' }),
      function(req, res) {
        res.json({ message: "Authenticated" })
      });

#### API

##### Constructor

    new HeaderAPIKeyStrategy(header, passReqToCallback, verify);

Arguments:
* `headerConfig` (Object):
    * `header` (String): name of the header field to be used for api keys, default: *X-Api-Key*.
    * `prefix` (String): prefix to be used in content of the header, eg. `Bearer adsfadsfa`, default: empty. Attention: give it with blank if needed, eg. `'Bearer '`.
* `passReqToCallback` (Boolean): flags whether an *express* Request object is passed to the *verify* function.
* `verify` (Function):
    * `apiKey` (String): parsed API key from from the request. Use it to determine, which user is using your endpoint.
    * `verified` (Function): Callback to be called when you have done the API key handling. Signature: `verify(err, user, info) => void`.
        * `err` (Error): return an Error if user is not verified, otherwise yield `null` here
        * `user` (Object, optional): only return user object if he is verified.
        * `info`(Object, optional): yield additional information to success or failure of user verification.
    * `req` (express.Request, optional): *express* Request object if `passReqToCallback` is set to true.

## Examples

    curl -v --header "Authorization: Api-Key asdasjsdgfjkjhg" http://127.0.0.1:3000/api/authenticate


## Contributing

Clone the repo, then
```
npm install
```
and here we go.
Develop your new features or fixes, test it using `npm test` and create a pull request.


## Credits

  - [CholaLabs](https://github.com/cholalabs)

[npm-url]: https://npmjs.org/package/passport-headerapikey
[download-url]: https://npmjs.org/package/passport-headerapikey
[npm-image]: https://img.shields.io/npm/v/passport-headerapikey.svg?style=flat
[downloads-image]: https://img.shields.io/npm/dm/passport-headerapikey.svg?style=flat
