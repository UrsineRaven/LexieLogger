// LexieLog
var express = require('express'),
  bodyParser = require('body-parser'),
  exphbs = require('express-handlebars');

var config = require('./site-config.json'),
  helpers = require('./helpers.js');

var app = express();

//===============EXPRESS=================

// Configure Express
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/static'));

// Session-persisted message middleware
app.use(function (req, res, next) {
  //var err = req.session.error,
  //  msg = req.session.notice,
  //  success = req.session.success;

  //delete req.session.error;
  //delete req.session.success;
  //delete req.session.notice;

  //if (err) res.locals.error = err;
  //if (msg) res.locals.notice = msg;
  //if (success) res.locals.success = success;

  next();
});

// Configure express to use handlebars templates
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    debug: function (optionalValue) {
      console.log("Current Context");
      console.log("====================");
      console.log(this);
      
      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    },
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
    endScripts: function (options) {
      this._endScripts = options.fn(this); 
      return null;
    }
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

//===============GLOBAL VARIABLES=================
app.locals.site = {
  name: config.Site.Name,
  description: config.Site.Description,
  author: config.Site.Author,
  url: config.Site.Url
}

//===============ROUTES=================
//displays the homepage with today's table
app.get('/', function (req, res) {
  helpers.getTodaysEvents().then(function(todaysEvents) {
    helpers.getEventTypes().then(function(visibleEventTypes) {
      res.render('home', { events: todaysEvents, eventTypes: visibleEventTypes });
        console.log(new Date().toLocaleString(), " | ", req.ip, " => Home");
    });
  });
});

app.post('/new-event/:event_id', function (req, res) {
  let time;
  if (req.body.Time)
    time = req.body.Time
  else
    time = helpers.getLocalIsoString(new Date()).split('T')[1].split('.')[0];
  helpers.logEvent(time, req.params.event_id);
        console.log(new Date().toLocaleString(), " | ", req.ip, " => New Event");
  //res.locals.success = "Successfully added event!";
  res.redirect('/');
});

app.get('/confirm/:type/:id', function (req, res) {
  let obj;
  if (req.params.type == 'event')
    helpers.getEvent(req.params.id).then(function(evt) {
        console.log(new Date().toLocaleString(), " | ", req.ip, " => Confirm");
      res.render('confirm', { type: req.params.type, object: evt[0] });
    });
  else
    helpers.getEventType(req.params.id).then(function(evtType) {
      res.render('confirm', { type: req.params.type, object: evtType[0] });
    });
});

app.get('/del-event/:event_id', function (req, res) {
  helpers.deleteEvent(req.params.event_id);
        console.log(new Date().toLocaleString(), " | ", req.ip, " => DelEvent");
  res.redirect('/');
});

app.get('/type-management', function (req, res) {
  helpers.getEventTypes().then(function(visibleEventTypes) {
        console.log(new Date().toLocaleString(), " | ", req.ip, " => TypeManagement");
    res.render('type', { eventTypes: visibleEventTypes });
  });
});

app.post('/modify-type', function (req, res) {
  // TODO: Scrub formatting to protect against script injection (at least remove '>'s )
  if (req.body.isDeleting) {
    // delete
    // really just hide the event type (so history is preserved)
    var eventType = {
      'show': false
    };
    helpers.modifyEventType(req.body.EventType, eventType);
    // TODO: Figure out why these locals don't pass through
    res.locals.success = "Successfully deleted event: " + req.body.Name + "!";
  } else if (req.body.EventType) {
    // modify
    var eventType = {
      'name': req.body.Name,
      'formatting': req.body.Formatting
    };
    helpers.modifyEventType(req.body.EventType, eventType);
    res.locals.success = "Successfully edited event: " + req.body.Name + "!";
  } else {
    // new
    var eventType = {
      'name': req.body.Name,
      'formatting': req.body.Formatting
    };
    helpers.addEventType(eventType);
    res.locals.success = "Successfully added event: " + req.body.Name + "!";
  }
        console.log(new Date().toLocaleString(), " | ", req.ip, " => ModifyEventType");
  res.redirect('/type-management');
});

//===============PORT=================
var port = process.env.PORT || config.Site.Port || 3030;
//===============SSL=================
if (config.Site.Use_Https) {
  var fs = require('fs'),
    https = require('https'),
    key = fs.readFileSync(__dirname + '/ssl/key.pem'),
    cert= fs.readFileSync(__dirname + '/ssl/cert.pem');
  https.createServer({ key: key, cert: cert }, app).listen(port);
} else {
  require('http').createServer(app).listen(port);
}
console.log('Listening on ' + port + '!');
