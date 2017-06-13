Ext.define('testFunc.util.context.UserContext', {

	//all config variable can be accessed by getter and setter, but no direct access
	config: {
	},

	constructor: function(config){
		this.initConfig(config);
		this.userId = 'testid';
		return this;
	},

	isLoggedIn: function(){
		return true;
	},

	getUserId: function(){
		return this.userId;
	},

	getUserName: function(){
		return 'test user';
	}

});