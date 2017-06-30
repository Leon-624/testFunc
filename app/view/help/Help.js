Ext.define('testFunc.view.help.Help', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.help',

    controller: 'help',

    layout: 'auto',

    title: 'Help',

    scrollable: true,

    initComponent: function(){
        me = this;
        this.dockedItems = [
        ];
    	this.items = [
            {
                xtype: 'component',
                padding: '10, 10, 20, 20',
                scrollable: true,
                style: {
                    //backgroundColor: '#b0e0e6'
                },
                //height: 170,
                //width: 65,
                loader:{
                    url : 'html/helpPage.html',
                    autoLoad : true,
                    listeners:{
                        //the handler name is looked up on the scope,
                        //which will also be the this reference when the method is called.
                        scope: me.controller,
                        load: 'onPalettesLoad'
                    }
                }
            }
    	];

    	this.callParent(arguments);
    },

    listeners: {
    	afterrender: 'onAfterRender'
    }

});