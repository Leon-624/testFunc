Ext.define('testFunc.util.context.DesignContext', {

	//all config variable can be accessed by getter and setter, but no direct access
	config: {
		designTitle: null,
		designDescription: null
	},

	constructor: function(config){
		this.initConfig(config);
		return this;
	}

});