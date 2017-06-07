Ext.define('testFunc.view.design.DesignViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.design',

    data: {
    	heading: 'Design You Own'
    },

    links: {
    	design: {
    		type: 'testFunc.model.DesignDetail',
    		create: {
    			designId: 0,
    			designTitle: 'Untitled Design',
    			designDescription: "",
    			designMemento: null,
    			canvasMemento: null,
    			designVersion: 0,
    			designParent: 0,
    			designTimestamp: "N/A",
                designCreateTimestamp: "N/A (Not Saved)",
    			designUserId: null
    		}
    	}
    }

});
