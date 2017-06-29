Ext.define('testFunc.view.user.UserLogin', {
	extend: 'Ext.window.Window',

	alias: 'widget.userlogin',

	controller: 'userlogin',

	title: 'User Login',
	layout: 'fit',
	autoShow: true,
	width: 320,

	config: {
		topView: null
	},

	initComponent: function(){
		this.items = [
			{
				xtype: 'form',
				reference: 'userLoginForm',
				margin: '15 15 15 15',
				items: [
					{
						xtype: 'textfield',
						reference: 'userIdTextfield',
						width: 280,
						name: 'userId',
						fieldLabel: 'User ID',
						allowBlank: false,
						maxLength: 20,
						disabled: false,
						msgTarget: 'under'
					},
					{
						xtype: 'textfield',
						inputType: 'password',
						reference: 'userPwdTextfield',
						width: 280,
						name: 'userPwd',
						fieldLabel: 'Password',
						allowBlank: false,
						maxLength: 20,
						disabled: false,
						msgTarget: 'under'
					}
				],
				buttons:[
					{
						text: 'Login',
						formBind: true,
						handler: 'onLoginClick'
					},
					{
						text: 'Cancel',
						handler: 'onLoginCancelClick'
					}
				]
			}
		];

		this.callParent(arguments);
	},

	listeners: {
		afterrender: 'onAfterRender',
		close: 'onClose'
	}

});