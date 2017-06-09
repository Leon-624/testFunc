Ext.define("testFunc.view.designtitle.DesignTitleViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.designtitle',

	onAfterRender: function(){
		this.designTitleTextfield = this.lookupReference('designTitleTextfield');
		this.topView = this.getView().getTopView();
		this.callback = this.getView().getCallback();
		this.serverResponse = null;
		this.loadMask = null;
		//mask topview; unmask upon cancel or close
		this.topView.mask();
	},

	//upon clicking save, call onSaveClick -> ifTitleValid -> onSaveClickCont
	onSaveClick: function(){
		var me = this;
		//show loadMask; destroy loadMask upon server response
		this.loadMask = new Ext.LoadMask({
			msg: 'One second...',
			target: me.getView()
		});
		this.loadMask.show();
		//examine title
		var title = this.designTitleTextfield.getValue();
		this.ifTitleValid(title);
	},

	onSaveClickCont: function(){
		//destroy loadMask
		this.loadMask.hide();
		this.loadMask.destroy();
		this.loadMask = null;
		//server responses 200
		if(this.serverResponse.success)
		{
			//title is unique, save title to global designContext and call back
			if(this.serverResponse.unique)
			{
				globalContextManager.getDesignContext().setDesignTitle(this.serverResponse.title);
				if(this.callback)
				{
					this.callback();
				}
				this.getView().close();
			}
			//title is not unique, display error msg
			else
			{
				this.designTitleTextfield.markInvalid("Design Title Already Exists");
			}
		}
		//server responses 500
		else
		{
			this.designTitleTextfield.markInvalid("Something is wrong");
		}
	},

	onCancelClick: function(){
		this.getView().close();
	},

	onClose: function(){
		//unmask topView if window is cancelled or closed
		if(this.topView)
		{
			if(this.topView.isMasked())
				this.topView.unmask();
		}
	},

	//set this.serverResponse
	ifTitleValid: function(title){
		this.serverResponse = null;
		var me = this;
		Ext.Ajax.request({
			url: 'http://localhost:8080/testFuncService/rest/designs/titletest',
			method: 'GET',
			//async: false,	//set as sync call so serverResponse can be set; discouraged
			params: {
				title: title
			},
			proxy:{
				reader: {
					type: 'json',
					successProperty: 'success'
				}
			},
			success: function(response, opts) {
				//Ext.decode() takes Json and parses
				me.serverResponse = Ext.decode(response.responseText);
				me.onSaveClickCont();
			},
			failure: function(response, opts) {
				me.serverResponse = Ext.decode(response.responseText);
				me.onSaveClickCont();
			}
		});
	}
});