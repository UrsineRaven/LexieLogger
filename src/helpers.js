var Q = require('q'),
	torm = require('typeorm'),
	sql = require('sqlite3'),
	Event = require(__dirname + '/model/Event.js').Event,
	EventType = require(__dirname + '/model/EventType.js').EventType;

torm.createConnection();

exports.exampleFunction = function(exampleParameter) {
	var deferred = Q.defer();
	if (error)
		deferred.reject(new Error(exampleErrObj));
	else
		deferred.resolve(exampleReturnObj);
	return deferred.promise;
};

exports.logEvent = function(time, eventTypeId) {
	let date = this.getLocalIsoString(new Date()).split('T')[0],
		evnt = {
			date: date,
			time: time,
			type: eventTypeId
		};
	return torm.getConnection()
	.getRepository(Event).save(evnt);
};

exports.getEvent = function(eventId) {
	return torm.getRepository(Event).find({id: eventId});
};

exports.deleteEvent = function(eventId) {
	let repo = torm.getRepository(Event);
	return repo.find({id: eventId}).then(function(evt) {
		return repo.remove(evt);
	});
};

exports.getTodaysEvents = function() {
	let date = this.getLocalIsoString(new Date()).split('T')[0];
	return torm.getRepository(Event).find({ where: {date: date}, order: { time: "DESC" } });
};

exports.getEventTypes = function() {
	//torm.getRepository(EventType).find().then(function(types){console.dir(types);});
	return torm.getConnection()
	.getRepository(EventType).find({show: 'true'});
};

exports.addEventType = function(eventType) {
	torm.getConnection()
	.getRepository(EventType).save(eventType);
};

exports.modifyEventType = function(eventId, eventType) {
	let repo = torm.getRepository(EventType),
	    et = repo.find(eventId);
	if (eventType.show === false)
		repo.update(eventId, { show: false });
	// if name changes, hide old event type, and make new one (so history is preserved)
	else if (et.name == eventType.name) {
		et.show = false;
		repo.save(et);
		this.addEventType(eventType);
	}
	else
		repo.update(eventId, eventType);
};

exports.getLocalIsoString = function(date) {
	return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
};
