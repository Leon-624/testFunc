Ext.define('testFunc.view.test.TestViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.test',

    data: {
    	heading: 'Design You Own'
    },

    links: {
    	design: {
    		type: 'testFunc.model.test',
    		/*create: {
    			designId: 0,
    			designTitle: 'Untitled Design',
    			designDescription: "",
    			designMemento: null,
    			canvasMemento: null,
    			designVersion: 0,
    			designParent: 0,
    			designTimestamp: 0,
    			designUserId: null
    		}*/
            create: {
                designId: 0,
                designTitle: 'Untitled Design'
            }
    	}
    }

});
