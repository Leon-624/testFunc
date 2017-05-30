Ext.define('testFunc.util.design.Design', {

	config: {
		designId: -1,
		designTitle: 'Untitled Design',
		designDescription: 'None',
		designJson: null,
		designVersion: 1,
		designParent: -1,
		designTimestamp: Date.now(),
		designUserId: 'testid'
	},

	constructor: function(config){
		this.initConfig(config);
		return this;
	}

});