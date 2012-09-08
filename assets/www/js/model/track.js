function Track(Properties) {
	this.Properties = Properties;
	this.Init();
};

Track.prototype.Init = function() {
	var objSelf = this;
	var Properties = objSelf.Properties;
	
	objSelf.setpositions( [] );
	
	for(var key in Properties) {
		var setterName = 'set' + key;
		if( Properties.hasOwnProperty(key) && typeof objSelf[setterName] === 'function' ) {
			objSelf[setterName](Properties[key]);
		};
	};
	
};

Track.prototype.setid = function(id) { this.id = id; };
Track.prototype.getid = function() { return this.id; };

Track.prototype.settitle = function(title) { this.title = title; };
Track.prototype.gettitle = function() { return this.title; };

Track.prototype.setcreated = function(d) { this.created = d; };
Track.prototype.getcreated = function() { return this.created; };

Track.prototype.setupdated = function(d) { this.updated = d; };
Track.prototype.getupdated = function() { return this.updated; };

Track.prototype.setpositions = function(p) { this.positions = p; };
Track.prototype.getpositions = function() { return this.positions; };

Track.prototype.addPosition = function( Position ) {
	if( this.isValidPosition(Position) ) {
		this.positions.push(Position);
	};
};

Track.prototype.isValidPosition = function( Position ) {
	if(
		true
		&& Position.hasOwnProperty('timestamp') 
		&& Position.hasOwnProperty('coords') 
		&& Position.coords.hasOwnProperty('latitude')
		&& Position.coords.hasOwnProperty('longitude')
		&& Position.coords.hasOwnProperty('altitude')
		&& typeof Position.coords.latitude === 'numeric'
		&& typeof Position.coords.longitude === 'numeric'
	) {
		return true;
	}
	return false;
};
