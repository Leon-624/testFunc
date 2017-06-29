Ext.define('testFunc.util.context.UserContext', {

	//all config variable can be accessed by getter and setter, but no direct access
	config: {
		userId: null,
		userName: "Guest"
	},

	constructor: function(config){
		this.initConfig(config);
		this.registeredCmpts = [];
		return this;
	},

	//if a component's appearance is associated with userContext, register this component,
	//so that notifyContextChange() can notify associated components upon user context change;
	//registered components should listen to event 'userContextChange'
	register: function(cmpt){
		this.registeredCmpts.push(cmpt);
	},

	//set up user context from accessToken
	//if user context changes, notify all registered components
	setUpContextFromToken: function(){
		var currUserId = this.getUserId();
		//set up user context from accessToken
		var token = localStorage.getItem('accessToken');
		if(token)
		{
			try{
				var decoded = jwt_decode(token),
					userId = decoded.uid,
					userName = decoded.unm;
				if(userId && userName)
				{
					this.setUserId(userId);
					this.setUserName(userName);
				}
			} catch (err){
				//jwt format error
			}
		}
		//check if user context changes; if changes, notify registered components
		if(currUserId != this.getUserId())
			this.notifyContextChange();
	},

	notifyContextChange: function(){
		for(var i = 0; i < this.registeredCmpts.length; ++i)
		{
			var cmpt = this.registeredCmpts[i];
			cmpt.fireEvent('userContextChange');
		}
	},

	isLoggedIn: function(){
		return (this.getUserId() != null);
	}

});