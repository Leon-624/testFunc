Ext.define('testFunc.util.manager.GlobalAgentManager', {

    //all config variable can be accessed by getter and setter, but no direct access
    config: {
        designSaveAgent: null,        //initialize in constructor
        designLoadAgent: null
    },

    constructor: function(config){
        //initialize designContext
        this.setDesignSaveAgent(Ext.create('testFunc.util.agent.DesignSaveAgent'));
        this.setDesignLoadAgent(Ext.create('testFunc.util.agent.DesignLoadAgent'));
        this.initConfig(config);
        return this;
    }

});