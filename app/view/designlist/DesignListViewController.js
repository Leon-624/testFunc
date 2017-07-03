Ext.define("testFunc.view.designlist.DesignListViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.designlist',

	onAfterRender: function(gridPanel){
		//register listInfoCmpt to globalEventManager
		this.listInfoCmpt = this.lookupReference('listInfoCmpt');
        globalEventManager.register('listInfoCmpt', this.listInfoCmpt);
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

	//load store based on user logged in; reset listInfoCmpt
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
		var me = this;
		this.designlistStore.load({
			//add callback to reset listInfoCmpt
			callback: function(records, operation, success){
				//loading success
				if(success)
				{
					var recordCount = records.length;
					globalEventManager.makeEvent('listInfoCmpt', 'updateListInfo', recordCount);
				}
				//loading failure
				else
				{
					globalEventManager.makeEvent('listInfoCmpt', 'updateListInfo', -1);
				}
			}
		});
	},

	//clear records in store; reset listInfoCmpt
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
		//reset listInfoCmpt
		globalEventManager.makeEvent('listInfoCmpt', 'updateListInfo', null);
	},

	onUpdateListInfo: function(recordCount){
		//user not logged in
		if(recordCount === null)
		{
			this.listInfoCmpt.setHtml('You need to log in to retrieve your list of designs.');
		}
		//new user without saved designs
		else if(recordCount === 0)
		{
			var info = 'Hello ' + this.userContext.getUserName();
			info += '! New here? Check out Help page for more information!';
			this.listInfoCmpt.setHtml(info);
		}
		//store loading error
		else if(recordCount === -1)
		{
			this.listInfoCmpt.setHtml('Loading error: something is wrong...');
		}
		//user with designs
		else
		{
			var info = 'Hello ' + this.userContext.getUserName();
			info += ('! You have ' + recordCount + ' saved designs.');
			this.listInfoCmpt.setHtml(info);
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
	},

	onUserContextChange: function(){
		//user logs in, load designList store; reset listInfo
		if(this.userContext.isLoggedIn())
		{
			this.loadDesignListStore();
		}
		//user logs out, clear designList store; reset listInfo
		else
		{
			this.clearDesignListStore();
			
		}
	}
});