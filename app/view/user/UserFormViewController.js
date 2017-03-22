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
	}

});