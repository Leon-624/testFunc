Ext.define('testFunc.view.designlist.DesignList', {
	extend: 'Ext.grid.Panel',

	alias: 'widget.designlist',

	controller: 'designlist',
	viewModel: 'designlist',

	bind: {
		title: '{title}'
	},

	initComponent: function(){
		//get store from viewModel
		this.store = this.getViewModel().getStore("designlist");
		this.columns = [
			{
				text: 'Design Title',
				dataIndex: 'designTitle',
				sortable: true,
				hideable: false,
				flex: 3
			},
			{
				text: 'Description',
				dataIndex: 'designDescription',
				sortable: false,
				hideable: true,
				flex: 3
			},
			{
				text: 'Modified Date',
				dataIndex: 'designTimestamp',
				sortable: true,
				hideable: true,
				flex: 3
			},
			{
				text: 'Creation Date',
				dataIndex: 'designCreateTimestamp',
				sortable: true,
				hideable: true,
				flex: 3
			},
			{
				text: 'Version',
				dataIndex: 'designVersion',
				sortable: true,
				hideable: true,
				flex: 1
			},
			{
				text: 'Action',
				//dataIndex: 'hehe',
				sortable: false,
				hideable: false,
				flex: 2
			}
		];
		this.callParent(arguments);
	},

	listeners:{
		afterrender: 'onAfterRender',
		itemdblclick: 'onItemDblClick'
	}

});