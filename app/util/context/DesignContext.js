Ext.define('testFunc.util.context.DesignContext', {

	//all config variable can be accessed by getter and setter, but no direct access
	config: {
		designTitle: null,			//update upon design loading, or designTitle window saving
		designDescription: "",		//update upon design loading, or description change
		canvas: null
	},

	constructor: function(config){
		this.initConfig(config);
		this.lastSavedHash = 0;		//update upon design saving, or design loading
		return this;
	},

	isDesignDirty: function(){
		var currHash = this.generateHashCode(this.getCanvas().getDesignMemento());
		//console.log("dirty? " + currHash + ": " + this.lastSavedHash);
		if(currHash === this.lastSavedHash)
			return false;
		else
			return true;
	},

	markCleanPoint: function(){
		this.lastSavedHash = this.generateHashCode(this.getCanvas().getDesignMemento());
		//console.log("clean point: " + this.lastSavedHash);
	},

	generateHashCode: function(obj){
		return JSON.stringify(obj).hashCode();
	}

});