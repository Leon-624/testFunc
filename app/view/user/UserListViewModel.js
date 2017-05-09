Ext.define('testFunc.view.user.UserListViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.userlist',

    constructor: function(config){
    	console.log("UserListViewModel Constructing");
    	this.callParent(arguments);
    },

    data: {
        title: 'All Users (try double-clicking or dragging the record?)'
    },

    stores: {
    	users: {
    		/*constructor: function(){
    			console.log("Store users Constructed");
    			this.callParent(arguments);
    		},*/

    		model: 'testFunc.model.User',
    		storeId: 'storeUsers',
			autoLoad: true,

			sorters: [{
         		property: 'userName',
         		direction: 'ASC'
     		},
     		{
        		 property: 'userEmail',
         		direction: 'ASC'
     		}],

			proxy:{
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
			},

			listeners: {
				load: function(){console.log("Store users is loading data");}
			}
    	}
    }

});
