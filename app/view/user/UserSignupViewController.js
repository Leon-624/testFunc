Ext.define("testFunc.view.user.UserSignupViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.usersignup',

	onAfterRender: function(){
		this.userSignupForm = this.lookupReference('userSignupForm');
		this.userIdTextfield = this.lookupReference('userIdTextfield');
		this.userPwdTextfield = this.lookupReference('userPwdTextfield');
		this.userNameTextfield = this.lookupReference('userNameTextfield');
		this.userEmailTextfield = this.lookupReference('userEmailTextfield');
		this.topView = this.getView().getTopView();
		this.callback = this.getView().getCallback();
		this.serverResponse = null;
		this.loadMask = null;
		//mask topview; unmask upon close
		this.topView.mask();
		//create model record
		this.record = Ext.create('testFunc.model.UserSignup', {
			userId: '',
			userPwd: '',
			userName: '',
			userEmail: ''
		});
		//do NOT associate form with record, as record initialized with empty fields,
		//while form has non-empty validation, there is unintended behavior
		//this.userSignupForm.loadRecord(this.record);
	},

	//upon clicking login, call onSignupClick -> signUpUser -> onSignupClickCont
	onSignupClick: function(){
		var me = this;
		//show loadMask; destroy loadMask upon server response
		this.loadMask = new Ext.LoadMask({
			msg: 'Signing Up...',
			target: me.getView()
		});
		this.loadMask.show();
		//sign up user
		this.record.set('userId', this.userIdTextfield.getValue());
		this.record.set('userPwd', this.userPwdTextfield.getValue());
		this.record.set('userName', this.userNameTextfield.getValue());
		this.record.set('userEmail', this.userEmailTextfield.getValue());
		this.signUpUser();
	},

	onSignupClickCont: function(){
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
				this.callback();
			}
			//show toast
			globalUtil.toast("Welcome " + globalContextManager.getUserContext().getUserName() + "!");
			this.getView().close();
		}
		//server responses 500
		else
		{
			this.userIdTextfield.markInvalid("User ID already exists.");
		}
	},

	//post user info for signing up; set this.serverResponse and call onSignupClickCont()
	signUpUser: function(){
		var me = this;
		this.serverResponse = null;
		//save record to post user info
		this.record.phantom = true;	//make sure model will use CREATE api
		this.record.save({
			success: function(thisRecord, operation){
				me.serverResponse = JSON.parse(operation.getResponse().responseText);
				me.onSignupClickCont();
			},
			failure: function(thisRecord, operation){
				me.serverResponse = JSON.parse(operation.error.response.responseText);
				me.onSignupClickCont();
			}
		});
	},

	onSignupCancelClick: function(){
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