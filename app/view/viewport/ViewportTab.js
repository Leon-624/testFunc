Ext.define('testFunc.view.viewport.ViewportTab', {
	extend: 'Ext.tab.Panel',

	alias: 'widget.viewporttab',

	controller: 'viewporttab',

	layout: 'anchor',

	/*Panel header consists of three parts (default order):
		1. cfg-items specified in header.items
		2. title
		3. tools specified in tools
	  The order can be arranged by header.titlePosition, header.itemPosition
	  In tab panel, tabBarHeaderPosition will render tabBar as an cfg-item in header,
	  the value will be used as header.itemPosition.
	*/
	title: 'Design Your Own',
	titleAlign: 'left',
	tabBarHeaderPosition: 1,

	//configuration object for the internal Ext.tab.Bar,
	//passed straight through to the TabBar's constructor
	tabBar: {
		tabStretchMax: true,
		height: 40
	},

	items: [
		{
			xtype: 'designlist',
			anchor: '100% 100%'
		},
		{
			xtype: 'design',
			anchor: '100% 100%'
		}
	],

	/*tools: [
		{
			xtype: 'tbspacer',
			width: '300'
		},
		{
			xtype: 'button',
			height: 30,
			text: 'hehe'
		}
	],*/

	initComponent: function(){
		this.callParent(arguments);
	},

	listeners: {
		afterrender: 'onAfterRender'
	}

});