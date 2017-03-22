Ext.define("testFunc.view.user.UserListViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.userlist',

	init: function(){
		console.log("UsersController initialized! Called after view's initCompoment being called.");
	},

	editUser: function(grid, record){
		console.log("double click on " + record.get('name'));
		var view = Ext.create({xtype: 'useredit'});
		//Loads an Ext.data.Model into this form.
		//The fields in the model are mapped to fields in the form by matching either the Ext.form.field.Base#name or Ext.Component#itemId.
		view.down("form").loadRecord(record);
	}

});