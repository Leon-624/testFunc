Ext.define("testFunc.view.designlist.DesignListViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.designlist',

	onAfterRender: function(gridPanel){
		//register designList view to userContext, as userContext affects its appearance;
        //upon user context changes, userContext will notify registered components
        this.userContext = globalContextManager.getUserContext();
        this.userContext.register(this.getView());
		//register DesignList to userContext
		this.designlistStore = this.getViewModel().getStore('designlist');
		//set global designListContext
		this.setDesignListContext();
		//examine if user logged in
		//already logged in
		if(this.userContext.isLoggedIn())
		{
			this.loadDesignListStore();
		}
		//not logged in
		else
		{
			//some action
		}
	},

	//load store based on user logged in
	loadDesignListStore: function(){
		var userId = this.userContext.getUserId();
		//set store READ api
		var proxy = this.designlistStore.getProxy();
		proxy.getApi().read = globalConst.modelUrl.designList.read + userId;
		//add token into header
		proxy.setHeaders({
			Authorization: 'Bearer ' + this.userContext.getToken()
		});
		//load store to retrieve design list
		this.designlistStore.load();
	},

	clearDesignListStore: function(){
		//reset store READ api
		var proxy = this.designlistStore.getProxy();
		proxy.getApi().read = globalConst.modelUrl.designList.read;
		//reset header
		proxy.setHeaders({
			Authorization: 'Bearer '
		});
		//remove items in store
		this.designlistStore.removeAll();
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
	},

	onUserContextChange: function(){
		//user logs in, load designList store
		if(this.userContext.isLoggedIn())
		{
			this.loadDesignListStore();
		}
		//user logs out
		else
		{
			this.clearDesignListStore();
		}
	}
});