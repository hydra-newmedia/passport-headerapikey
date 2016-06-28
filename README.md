# Passport-LocalAPIKey

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

    passport.use(new HeaderAPIKeyStrategy(
      'apikey',
      false,
      function(apikey, done) {
        User.findOne({ apikey: apikey }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user);
        });
      }
    ));

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

## Examples

    curl -v --header "apikey: asdasjsdgfjkjhg" http://127.0.0.1:3000/api/authenticate


## Contributing

Clone the repo, then
```
npm install
node_modules/typings/dist/bin.js install
```
and here we go.
Develop your new features or fixes, test it using `npm test` and create a pull request.


## Credits

  - [CholaLabs](https://github.com/cholalabs)