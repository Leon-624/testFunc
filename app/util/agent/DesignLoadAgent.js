Ext.define('testFunc.util.agent.DesignLoadAgent', {

	//all config variable can be accessed by getter and setter, but no direct access
    config: {
        designContext: null		//initialize in constructor
    },

    constructor: function(config){
    	//initialize designContext
    	this.config.designContext = Ext.create('testFunc.util.design.Design');
        this.initConfig(config);
        return this;
    }

});