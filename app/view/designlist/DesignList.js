Ext.define('testFunc.view.designlist.DesignList', {
	extend: 'Ext.grid.Panel',

	alias: 'widget.designlist',

	controller: 'designlist',
	viewModel: 'designlist',

	bind: {
		title: '{title}'
	},

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top'
		}
	],

	initComponent: function(){
		//get store from viewModel
		this.store = this.getViewModel().getStore("designlist");
		this.dockedItems = [
			{
				xtype: 'toolbar',
				dock: 'top',
				items: [
					{
						xtype: 'component',
						reference: 'listInfoCmpt',
						//html will be changed upon loadDesignListStore, clearDesignListStore
						//and updateRecord in designListContext, through 'onUpdateListInfo' event
						html: 'You need to log in to retrieve your list of designs.',
						listeners: {
							updateListInfo: 'onUpdateListInfo'
						}
					}
				]
			}
		];
		this.columns = [
			{
				text: 'Design Title',
				dataIndex: 'designTitle',
				sortable: true,
				hideable: false,
				draggable: true,
				bind: {
					flex: '{titleFlex}'
				}
			},
			{
				text: 'Description',
				dataIndex: 'designDescription',
				sortable: false,
				hideable: true,
				draggable: true,
				bind: {
					flex: '{descriptionFlex}'
				}
			},
			{
				text: 'Modified Date',
				dataIndex: 'designTimestamp',
				sortable: true,
				hideable: true,
				draggable: true,
				bind: {
					flex: '{modifiedFlex}'
				}
			},
			{
				text: 'Creation Date',
				dataIndex: 'designCreateTimestamp',
				sortable: true,
				hideable: true,
				draggable: true,
				bind: {
					flex: '{creationFlex}'
				}
			},
			{
				text: 'Version',
				dataIndex: 'designVersion',
				sortable: true,
				hideable: true,
				draggable: true,
				bind: {
					flex: '{versionFlex}'
				}
			},
			{
				text: 'Action',
				xtype: 'widgetcolumn',
				sortable: false,
				hideable: false,
				draggable: true,
				stopSelection: false,	//do not prevent grid selection upon click on the widget
				bind: {
					flex: '{actionFlex}'
				},
				widget: {
					xtype: 'button',
					text: 'Edit Design',
					style: 'background-color:#29a329',
					listeners: {
						mouseover: 'onActionButtonMouseOver',
						mouseout: 'onActionButtonMouseOut',
						focus: 'onActionButtonFocus',
						click: 'onActionButtonClick'
					}
				}
			}
		];
		this.callParent(arguments);
	},

	listeners:{
		afterrender: 'onAfterRender',
		itemdblclick: 'onItemDblClick',
		userContextChange: 'onUserContextChange'
	}

});