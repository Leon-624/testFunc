Ext.define('testFunc.view.design.Design', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.design',

    controller: 'design',

    layout: 'hbox',
    title: 'Design (try connecting ports of entities by drag-drop or click-click?)',

    initComponent: function(){
        me = this;
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                style: {
                    backgroundColor: '#f2f2f2'
                },
                items: [
                    {
                        xtype: 'component',
                        html: 'Design Title'
                    },
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'splitbutton',
                        text: 'Save',
                        handler: 'onSaveClick',
                        menu: new Ext.menu.Menu({
                            items: [
                                // these will render as dropdown menu items when the arrow is clicked:
                                {text: 'Menu Item 1', handler: function(){ Ext.Msg.alert('alert', "Item 1 was clicked"); }},
                                {text: 'Menu Item 2', handler: function(){ Ext.Msg.alert('alert', "Item 2 was clicked"); }}
                            ]
                        })
                    }
                ]
            }
        ];
    	this.items = [
    		{
    			xtype: 'component',
    			//height: 200,
    			loader:{
    				url : 'html/schematicPalettes.html',
                    autoLoad : true,
                    listeners:{
                        scope: me.controller,
                        load: 'onPalettesLoad'
                    }
    			}
    		},
    		{
    			xtype: 'component',
    			autoScroll: true,
    			html: '<div id="gfx_holder" class="ui-droppable" style="width:1000px; height:600px; background-color:#eff5ff;"></div>'
                    + '<div id="zoomSlider" style="height:150px; position:absolute; top:30px; left:30px; z-index:26000"></div>'
    		}
    	];

    	this.callParent(arguments);
    },

    listeners: {
    	afterrender: 'onAfterRender'
    }

});