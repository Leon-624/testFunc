Ext.define('testFunc.view.user.UserList', {
	extend: 'Ext.grid.Panel',

	alias: 'widget.userlist',

	controller: 'userlist',
	viewModel: 'userlist',
	/*viewModel: {
		type: 'userlist'
	},*/
	//store: {},

	bind: {
		title: '{title}'
	},

	viewConfig: {
		plugins: {
			//drag drop plugin for grid
			ptype: 'gridviewdragdrop',
			ddGroup: 'userList',
			dragText: 'Drag and drop record to re-order or fill the form'
		}
	},

	constructor: function(config){
    	console.log("View UserList Constructing");
    	this.callParent(arguments);
    },

	initComponent: function(){
		//inline store
		/*this.store = {
			fields: ['name', 'email'],
			data: [
				{name: 'N1', email: 'N1@gmail.com'},
				{name: 'N2', email: 'N2@gmail.com'}
			]
		};*/

		//use separate store class
		//this.store = Ext.create('AccountManager.store.Users');

		//use viewmodel
		this.store = this.getViewModel().getStore("users");

		this.columns = [
			{header: 'Name', dataIndex: 'name', flex: 1},
			{header: 'Email', dataIndex: 'email', flex: 1}
		];

		this.callParent(arguments);
	},

	listeners:{
		itemdblclick: 'editUser'
	}

});