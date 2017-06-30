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
		},
		{
			xtype: 'help',
			anchor: '100% 100%'
		}
	],

	tools: [
		{
			//userButton's appearance will be set up upon render
			xtype: 'splitbutton',
			reference: 'userButton',
			text: 'Guest',
			padding: '2 5 2 5',
			margin: '0 0 0 0',	//margin will be set up upon render or resize to center the tab
			menu: {
				xtype: 'menu',
				plain: true,
				items: [
					{
						text: 'Log In',
						index: 0,
						reference: 'userLogMenuItem'
					},
                	{
                		text: 'Sign Up',
                		index: 1,
                		reference: 'userSignUpMenuItem'
                	}
				],
				listeners: {
					click: 'onUserMenuClick'
				}
			},
			listeners: {
				mouseover: 'onUserButtonMouseOver',
				mouseout: 'onUserButtonMouseOut',
				userContextChange: 'onUserContextChange'
			}
		}
	],

	initComponent: function(){
		this.callParent(arguments);
	},

	listeners: {
		afterrender: 'onAfterRender',
		resize: 'onResize'
	}

});