Ext.define('testFunc.util.context.GlobalContext', {

	//all config variable can be accessed by getter and setter, but no direct access
    config: {
        designContext: null		//initialize in constructor
    },

    constructor: function(config){
    	//initialize designContext
        this.setDesignContext(Ext.create('testFunc.util.context.DesignContext'));
        this.initConfig(config);
        return this;
    }

});