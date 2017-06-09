Ext.define('testFunc.util.manager.GlobalContextManager', {

	//all config variable can be accessed by getter and setter, but no direct access
    config: {
        designContext: null,        //initialize in constructor
        userContext: null,
        designListContext: null
    },

    constructor: function(config){
    	//initialize designContext
        this.setDesignContext(Ext.create('testFunc.util.context.DesignContext'));
        this.setUserContext(Ext.create('testFunc.util.context.UserContext'));
        this.setDesignListContext(Ext.create('testFunc.util.context.DesignListContext'));
        this.initConfig(config);
        return this;
    }

});