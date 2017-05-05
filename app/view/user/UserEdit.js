Ext.define('testFunc.view.user.UserEdit', {
	extend: 'Ext.window.Window',

	alias: 'widget.useredit',

	controller: 'useredit',

	title: 'Edit User',
	layout: 'fit',
	autoShow: true,

	initComponent: function(){
		this.items = [
			{
				xtype: 'form',
				margin: '5 5 5 5',
				items: [
					{
						xtype: 'textfield',
						name: 'userName',
						fieldLabel: 'name'
					},
					{
						xtype: 'textfield',
						name: 'userEmail',
						fieldLabel: 'email'
					}
				],
				buttons:[
					{
						text: 'Save',
						handler: 'updateUser'
					},
					{
						text: 'Cancel',
						handler: function(){this.up('window').close();}
					}
				]
			}
		];

		this.callParent(arguments);
	}

});