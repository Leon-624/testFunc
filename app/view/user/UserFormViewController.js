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
			//add record to store and sync
			var storeUsers = Ext.getStore('storeUsers');
			var newRecord = Ext.create('testFunc.model.User',{  
    			userId: 0,
				userName: values.userName,
				userEmail: values.userEmail
			});
			newRecord.phantom = true;
			storeUsers.add(newRecord);
			storeUsers.sync();
			form.reset();
			//post form data
			/*form.submit({
				success: function(form, action) {
					//add to store
					Ext.Msg.alert('Success', action.result.msg);
				},
				failure: function(form, action) {
					Ext.Msg.alert('Failed', action.result.msg);
				}
			});*/
		}
	}

});