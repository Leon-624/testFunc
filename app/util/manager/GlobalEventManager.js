Ext.define('testFunc.util.manager.GlobalEventManager', {

	//all config variable can be accessed by getter and setter, but no direct access
    config: {
    },

    constructor: function(config){
        this.initConfig(config);
        this.registeredCmpt = {};
        return this;
    },

    //components call register() to register themselves in each afterrender handler
    register: function(cmptName, cmptObj){
        //DON'T USE this.registeredCmpt.cmptName,
        //because cmptName will not be interpreted by its actual string value
        this.registeredCmpt[cmptName] = cmptObj;
    },

    isRegistered: function(cmptName){
        if(this.registeredCmpt[cmptName])
            return true;
        else
            return false;
    },

    //fire event of specified component
    makeEvent: function(cmptName, eventName, eventObj){
        if(this.registeredCmpt[cmptName])
        {
            this.registeredCmpt[cmptName].fireEvent(eventName, eventObj);
        }
        //component not registered, print error msg
        else
        {
            console.log("GlobalEventAgent: " + cmptName + " is not registered.");
        }
    }
});