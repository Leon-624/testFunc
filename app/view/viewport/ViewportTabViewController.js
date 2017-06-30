Ext.define("testFunc.view.viewport.ViewportTabViewController", {
	extend: 'Ext.app.ViewController',

	alias: 'controller.viewporttab',

	onAfterRender: function(tabpanel){
		this.userButton = this.lookupReference('userButton');
		this.userLogMenuItem = this.lookupReference('userLogMenuItem');
		this.userSignUpMenuItem = this.lookupReference('userSignUpMenuItem');
		//center tab position
		this.centerTabPosition(this.getView().getWidth());
		//set up user context
		this.userContext = globalContextManager.getUserContext();
		//register userButton to userContext, as userContext affects userButton's appearance;
		//when user context changes, userButton will be notified by event 'userContextChange'
		this.userContext.register(this.userButton);
		this.setUpUserButtonAppearance();
	},

	onResize: function(tabpanel, width, height){
		this.centerTabPosition(width);
	},

	centerTabPosition: function(width){
		this.userButton.setMargin('0 0 0 ' + (width/2 - 150));
	},

	onUserButtonMouseOver: function(button){
		//upon hover, if menu is hide, show menu
		if(!this.userButton.hasVisibleMenu())
		{
			this.userButton.showMenu();
		}
	},

	//upon user context change, set up userButton's appearance
	onUserContextChange: function(){
		this.setUpUserButtonAppearance();
	},

	//set up userButton based on userContext
	setUpUserButtonAppearance: function(){
		//set up user button text (user name); control the length
		var userName = this.userContext.getUserName();
		if(userName.length > 10)
			userName = userName.substr(0, 7) + '..';
		this.userButton.setText(userName);
		//set up user menu
		if(this.userContext.isLoggedIn())
		{
			this.userLogMenuItem.setText('Log Out');
			this.userSignUpMenuItem.setText('Your Details');
		}
		else
		{
			this.userLogMenuItem.setText('Log In');
			this.userSignUpMenuItem.setText('Sign Up');
		}
	},

	onUserMenuClick: function(menu, item){
		if(item)
		{
			if(item.index === 0)
			{
				if(item.text === 'Log In')
				{
					this.onLogInClick();
				}
				else if(item.text === 'Log Out')
				{
					this.onLogOutClick();
				}
			}
			else if(item.index === 1)
			{
				if(item.text === 'Sign Up')
				{
					this.onSignUpClick();
				}
				else if(item.text === 'Your Details')
				{
					Ext.Msg.alert('Your Details', 'Implementing soon.');
				}
			}
		}
	},

	onLogInClick: function(){
		var window = Ext.create({
			xtype: 'userlogin',
			topView: this.getView()
		});
	},

	onLogOutClick: function(){
		var me = this;
        Ext.Msg.show({
            title:'Logging Out',
            message: 'Are you sure you would like to log out? (Unsaved changes will be lost)',
            buttons: Ext.Msg.YESNOCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn){
            	//log out user
                if(btn === 'yes')
                {
                	//remove token and reset userContext
                	//design and designList will be reset because userContext will notify change
                	localStorage.removeItem('accessToken');
                	me.userContext.setUpContextFromToken();
                	//show toast
                    globalUtil.toast("Logged Out");
                }
                //do not log out
                else
                {
                	//no action
                }
            }
        });
	},

	onSignUpClick: function(){
		var window = Ext.create({
			xtype: 'usersignup',
			topView: this.getView()
		});
	}
});