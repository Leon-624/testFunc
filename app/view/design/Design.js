Ext.define('testFunc.view.design.Design', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.design',

    controller: 'design',

    layout: 'hbox',
    title: 'Design (try connecting ports of entities by drag-drop or click-click?)',

    initComponent: function(){
        me = this;
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
    			html: '<div id="gfx_holder" class="ui-droppable" style="width:800px; height:400px; background-color:#eff5ff;"></div>'
    		}
    	];

    	this.callParent(arguments);
    },

    listeners: {
    	afterrender: 'onAfterRender'
    }

});