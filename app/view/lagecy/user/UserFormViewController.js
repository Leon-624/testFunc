Ext.define("testFunc.view.user.UserFormViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.userform',

	init: function(){
		console.log("UserFormController initialized!");
	},

	setDD: function(me){
		//me.body is body dom.Element
		var formDropTarget = Ext.create('Ext.dd.DropTarget', me.body, {
			ddGroup: "userRecord",

			notifyEnter: function(dragSource, event, data){
				//me.body.stopAnimation();
				me.body.highlight();
			},

			notifyDrop: function(dragSource, event, data){
				var selectedRecord = dragSource.dragData.records[0];
				me.getForm().loadRecord(selectedRecord);
				//dragSource.view.store.remove(selectedRecord);
			}
		});
	},

	createUser: function() {
		var form = this.getView().getForm(),
			values = form.getValues();
		if (form.isValid()) {
			/*
			//add record to store and sync
			var storeUsers = Ext.getStore('storeUsers');
			var newRecord = Ext.create('testFunc.model.User',{  
    			userId: 0,
				userName: values.userName,
				userEmail: values.userEmail
			});
			//has to set phantom equals true
			//so store knows this record is not in server side and make post call
			newRecord.phantom = true;
			storeUsers.add(newRecord);
			storeUsers.sync();
			Ext.Msg.alert('Success', "User Record Added");
			form.reset();
			*/
			//post form data
			form.submit({
				success: function(form, action) {
					//add to store
					Ext.Msg.alert('Success', action.result.msg);
					form.reset();
					Ext.getCmp('userlistId').store.load();
				},
				failure: function(form, action) {
					Ext.Msg.alert('Failed', action.result.msg);
					Ext.getCmp('userlistId').store.load();
				}
			});
		}
	}

});