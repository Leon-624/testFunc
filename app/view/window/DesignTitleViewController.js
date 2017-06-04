Ext.define("testFunc.view.window.DesignTitleViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.designtitle',

	onAfterRender: function(){
		this.designTitleTextfield = this.lookupReference('designTitleTextfield');
		this.topView = this.getView().getTopView();
		this.callback = this.getView().getCallback();
	},

	onSaveClick: function(){
		var title = this.designTitleTextfield.getValue();
		//title is unique, save title to global designContext and call back
		if(this.ifTitleValid(title))
		{
			globalContext.getDesignContext().setDesignTitle(title);
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
	},

	onCancelClick: function(){
		this.getView().close();
	},

	onClose: function(){
		//unmask topView if window is cancelled or closed
		if(this.topView && !globalContext.getDesignContext().getDesignTitle())
		{
			if(this.topView.isMasked())
				this.topView.unmask();
		}
	},

	ifTitleValid: function(){
		return true;
	}
});