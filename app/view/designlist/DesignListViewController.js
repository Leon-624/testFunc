Ext.define("testFunc.view.designlist.DesignListViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.designlist',

	onAfterRender: function(gridPanel){
		this.designlistStore = this.getViewModel().getStore('designlist');
		//set global designListContext
		this.setDesignListContext();
		//examine if user logged in
		var userContext = globalContextManager.getUserContext();
		//already logged in
		if(userContext.isLoggedIn())
		{
			var userId = userContext.getUserId();
			//set store READ api
			this.designlistStore.getProxy().getApi().read = globalConst.modelUrl.designList.read + userId;
			//load store to retrieve design list
			this.designlistStore.load();
		}
		//not logged in
		else
		{
			//some action
		}
	},

	setDesignListContext: function(){
		globalContextManager.getDesignListContext().setDesignListStore(this.designlistStore);
	},

	onActionButtonClick: function(button, event){
		button.setStyle('backgroundColor', '#ff9900');
		//get associated record
		var rowIndex = button.up('gridview').indexOf(button.el.up('table')),
			record = this.getView().getStore().getAt(rowIndex);
		button.up('viewporttab').setActiveTab(1);
		globalAgentManager.getDesignLoadAgent().loadDesign(record.get('designId'));
	},

	onActionButtonMouseOver: function(button){
		button.setStyle('backgroundColor', '#ff9900');
	},

	onActionButtonMouseOut: function(button){
		button.setStyle('backgroundColor', '#29a329');
	},

	onActionButtonFocus: function(button){
		button.setStyle('backgroundColor', '#e65c00');
	}
});