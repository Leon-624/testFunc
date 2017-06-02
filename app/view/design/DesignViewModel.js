Ext.define('testFunc.view.design.DesignViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.design',

    constructor: function(config){
    	console.log("DesignViewModel Constructing");
    	this.callParent(arguments);
    },

    stores: {
    	design: {
    		/*constructor: function(){
    			console.log("Store users Constructed");
    			this.callParent(arguments);
    		},*/

    		model: 'testFunc.model.Design',
    		storeId: 'design',
			autoLoad: false,

			/*proxy:{
				type: 'ajax',
				api: {
					read: 'http://localhost:8080/testFuncService/rest/users',
					update: 'http://localhost:8080/testFuncService/rest/users/update',
					create: 'http://localhost:8080/testFuncService/rest/users/create'
				},
				reader: {
					type: 'json',
					rootProperty: 'users'
					//successProperty: 'success'
				},
				writer: {
					type: 'json',
					writeAllFields: true
					//rootProperty: 'users',
					//encode: true
				}
			}*/
    	}
    }

});
