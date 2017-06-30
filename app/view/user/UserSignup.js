Ext.define('testFunc.view.user.UserSignup', {
	extend: 'Ext.window.Window',

	alias: 'widget.usersignup',

	controller: 'usersignup',

	title: 'User Signup',
	layout: 'fit',
	autoShow: true,
	width: 320,

	config: {
		topView: null,
		callback: null
	},

	initComponent: function(){
		this.items = [
			{
				xtype: 'form',
				reference: 'userSignupForm',
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
					},
					{
						xtype: 'textfield',
						reference: 'userNameTextfield',
						width: 280,
						name: 'userName',
						fieldLabel: 'Name',
						allowBlank: false,
						maxLength: 40,
						disabled: false,
						msgTarget: 'under'
					},
					{
						xtype: 'textfield',
						reference: 'userEmailTextfield',
						width: 280,
						name: 'userEmail',
						fieldLabel: 'Email',
						allowBlank: false,
						maxLength: 40,
						vtype: 'email',
						disabled: false,
						msgTarget: 'under'
					}
				],
				buttons:[
					{
						text: 'Signup',
						formBind: true,
						handler: 'onSignupClick'
					},
					{
						text: 'Cancel',
						handler: 'onSignupCancelClick'
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