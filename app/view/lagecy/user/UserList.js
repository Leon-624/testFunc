Ext.define('testFunc.view.user.UserList', {
	extend: 'Ext.grid.Panel',

	alias: 'widget.userlist',
	id: 'userlistId',

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
			ddGroup: 'userRecord',
			dragText: 'Drag and drop record to re-order or fill the form'
		}
	},

	constructor: function(config){
    	console.log("View UserList Constructing");
    	this.callParent(arguments);
    },

	initComponent: function(){
		this.store = this.getViewModel().getStore("designlist");

		this.columns = [
			{header: 'Name', dataIndex: 'userName', flex: 1},
			{header: 'Email', dataIndex: 'userEmail', flex: 1}
		];

		this.callParent(arguments);
	},

	listeners:{
		itemdblclick: 'editUser'
	}

});