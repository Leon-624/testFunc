Ext.define('testFunc.view.user.UserForm', {
	extend: 'Ext.form.Panel',

	alias: 'widget.userform',

	title: "User Record Form",

	controller: 'userform',

	bodyPadding: 40,
	layout: 'form',
	region: 'center',
	border: true,

	initComponent: function(){
		this.items = [
			{
				xtype: 'textfield',
				fieldLabel: 'Name',
				name: 'name'
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Email',
				name: 'email'
			}
		];

		this.callParent(arguments);
	},

	listeners: {
		afterrender: 'setDD'
	}

});