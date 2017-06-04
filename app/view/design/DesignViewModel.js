Ext.define('testFunc.view.design.DesignViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.design',

    data: {
    	heading: 'Design You Own'
    },

    links: {
    	design: {
    		type: 'testFunc.model.Design',
    		create: {
    			designId: -1,
    			designTitle: 'Untitled Design',
    			designDescription: "",
    			designMemento: null,
    			canvasMemento: null,
    			designVersion: 0,
    			designParent: -1,
    			designTimestamp: -1,
    			designUserId: null
    		}
    	}
    }

});
