persistence.store.websql.config(persistence, 'truestreettracks', 'True Street Tracks', 10 * 1024 * 1024);

var PersistenceModel = {};

var Track = persistence.define('Track', {
	title: "TEXT",
    created: "TEXT",
	updated: "TEXT",
	distance: "INT"
});

var Position = persistence.define('Position', {
	timestamp: "DATE",
	latitude: "INT",
    longitude: "INT",
	altitude: "INT",
	accuracy: "INT",
	heading: "INT",
	speed: "INT"
});

Track.hasMany('positions', Position, 'track');

persistence.schemaSync();
