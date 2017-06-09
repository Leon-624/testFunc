Ext.define('testFunc.util.context.DesignContext', {

	//all config variable can be accessed by getter and setter, but no direct access
	config: {
		designTitle: null,		//update upon design loading, or designTitle window saving
		designDescription: "",	//update upon design loading, or description change
		canvas: null			//draw2d.CustomDraw2d; set by DesignViewController in setDesignContext method
	},

	constructor: function(config){
		this.initConfig(config);
		//lastSavedHash: first update by DesignViewController in setDesignContext method,
		//then update upon design saving, or design loading by design save/load agents
		this.lastSavedHash = 0;
		return this;
	},

	isDesignDirty: function(){
		var currHash = this.getDesignHashCode();
		//console.log("dirty? " + currHash + ": " + this.lastSavedHash);
		if(currHash === this.lastSavedHash)
			return false;
		else
			return true;
	},

	markCleanPoint: function(){
		this.lastSavedHash = this.getDesignHashCode();
		//console.log("clean point: " + this.lastSavedHash);
	},

	//design hashcode = designMemento.hashCode + designTitle.hashCode
	getDesignHashCode: function(){
		//generate designMemento hashcode
		var designMementoHash = JSON.stringify(this.getCanvas().getDesignMemento()).hashCode();
		//generate designTitle hashcode
		var designTitleHash = 0;	//if designTitle is null, return 0
		if(this.getDesignTitle())
			designTitleHash = this.getDesignTitle().hashCode();
		//return sum of hash
		return designMementoHash + designTitleHash;
	}

});