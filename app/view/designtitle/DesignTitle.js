Ext.define('testFunc.view.designtitle.DesignTitle', {
	extend: 'Ext.window.Window',

	alias: 'widget.designtitle',

	controller: 'designtitle',

	title: 'Save Design',
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
				margin: '15 15 15 15',
				items: [
					{
						xtype: 'textfield',
						reference: 'designTitleTextfield',
						name: 'designTitle',
						fieldLabel: 'Design Title',
						value: 'Untitled Design',
						allowBlank: false,
						maxLength: 95,
						disabled: false,
						msgTarget: 'under'
					}
				],
				buttons:[
					{
						text: 'Save',
						formBind: true,
						handler: 'onSaveClick'
					},
					{
						text: 'Cancel',
						handler: 'onCancelClick'
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