Ext.define("testFunc.view.user.UserLoginViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.userlogin',

	onAfterRender: function(){
		this.userLoginForm = this.lookupReference('userLoginForm');
		this.userIdTextfield = this.lookupReference('userIdTextfield');
		this.userPwdTextfield = this.lookupReference('userPwdTextfield');
		this.topView = this.getView().getTopView();
		this.callback = this.getView().getCallback();
		this.serverResponse = null;
		this.loadMask = null;
		//mask topview; unmask upon close
		this.topView.mask();
		//create model record
		this.record = Ext.create('testFunc.model.UserLogin', {
			userId: '',
			userPwd: ''
		});
		//do NOT associate form with record, as record initialized with empty fields,
		//while form has non-empty validation, there is unintended behavior
		//this.userLoginForm.loadRecord(this.record);
	},

	//upon clicking login, call onLoginClick -> validateUser -> onLoginClickCont
	onLoginClick: function(){
		var me = this;
		//show loadMask; destroy loadMask upon server response
		this.loadMask = new Ext.LoadMask({
			msg: 'Validating...',
			target: me.getView()
		});
		this.loadMask.show();
		//validate user
		this.record.set('userId', this.userIdTextfield.getValue());
		this.record.set('userPwd', this.userPwdTextfield.getValue());
		this.validateUser();
	},

	onLoginClickCont: function(){
		//destroy loadMask
		this.loadMask.hide();
		this.loadMask.destroy();
		this.loadMask = null;
		//server responses 200
		if(this.serverResponse.success)
		{
			//set access token to localStorage
			localStorage.setItem("accessToken", this.serverResponse.accessToken)
			//update userContext (userContext will notify any associated components)
			globalContextManager.getUserContext().setUpContextFromToken();
			//callback if defined
			if(this.callback)
			{
				//callback could be from designSaveAgent
				this.callback();
			}
			//show toast
			globalUtil.toast("Welcome " + globalContextManager.getUserContext().getUserName() + "!");
			this.getView().close();
		}
		//server responses 401
		else
		{
			this.userPwdTextfield.markInvalid("Information doesn't match any record.");
		}
	},

	//post user info for validation; set this.serverResponse and call onLoginClickCont()
	validateUser: function(){
		var me = this;
		this.serverResponse = null;
		//save record to post user info
		this.record.phantom = true;	//make sure model will use CREATE api
		this.record.save({
			success: function(thisRecord, operation){
				me.serverResponse = JSON.parse(operation.getResponse().responseText);
				me.onLoginClickCont();
			},
			failure: function(thisRecord, operation){
				me.serverResponse = JSON.parse(operation.error.response.responseText);
				me.onLoginClickCont();
			}
		});
	},

	onLoginCancelClick: function(){
		this.getView().close();
	},

	onClose: function(){
		//unmask topView if window is closed
		if(this.topView)
		{
			if(this.topView.isMasked())
				this.topView.unmask();
		}
	}
});