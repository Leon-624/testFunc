Ext.define("testFunc.view.designlist.DesignListViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.designlist',

	onAfterRender: function(){
		this.designlistStore = this.getViewModel().getStore('designlist');
		//set global designListContext
		globalContext.getDesignListContext().setDesignListStore(this.designlistStore);
		//examine if user logged in
		var userContext = globalContext.getUserContext();
		//already logged in
		if(userContext.isLoggedIn())
		{
			var userId = userContext.getUserId();
			//set store READ api
			this.designlistStore.getProxy().getApi().read += userId;
			//load store to retrieve design list
			this.designlistStore.load();
		}
		//not logged in
		else
		{
			//some action
		}
	}

});