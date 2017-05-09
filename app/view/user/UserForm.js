Ext.define('testFunc.view.user.UserForm', {
	extend: 'Ext.form.Panel',

	alias: 'widget.userform',

	title: "Create User",

	controller: 'userform',

	bodyPadding: 40,
	layout: 'form',
	region: 'center',
	border: true,

	//url: 'http://localhost:8080/testFuncService/rest/users/create',

	initComponent: function(){
		this.items = [
			{
				xtype: 'textfield',
				fieldLabel: 'Name',
				name: 'userName',
				allowBlank: false,
				maxLength: 50
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Email',
				name: 'userEmail',
				vtype: 'email',
				maxLength: 50
			}
		];

		this.buttons = [
			{
        		text: 'Reset',
        		handler: function() {
            		this.up('form').getForm().reset();
        		}
    		},
    		{
        		text: 'Submit',
        		formBind: true, //only enabled once the form is valid
        		disabled: true,
        		handler: 'createUser'
    		}
    	];

		this.callParent(arguments);
	},

	listeners: {
		afterrender: 'setDD'
	}

});