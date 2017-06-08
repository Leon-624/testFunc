Ext.define("testFunc.view.user.UserEditViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.useredit',

	init: function(){
		console.log("UserEditController initialized!");
	},

	updateUser: function(button){
		console.log("Click on Save button with form values: ");
		var form = button.up('form');
		//getRecord() returns the currently loaded model instance if loaded via loadRecord
		var record = form.getRecord();
		var values = form.getValues();
		console.log(values);
		record.set(values);

		
		//synchronize the store after editing the record
		//Approach one: using the viewModel attached to the view for this controller
		//Approach two: using unique storeId
    	Ext.getStore('storeUsers').sync();

		button.up('window').close();
	}

});