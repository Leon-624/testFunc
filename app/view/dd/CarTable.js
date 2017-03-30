/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('testFunc.view.dd.CarTable', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.cartable',

    requires: [
    ],

    controller: 'cartable',
    asdf: 'cartable',
    //viewModel: 'main',

    //ui: 'navigation',
    layout: 'hbox',
    title: 'test DD',

    initComponent: function(){
        me = this;
        this.items = [
            {
                xtype: 'panel',
                itemId: 'carGroup1',
                title: 'car1',
                //layout: 'vbox',
                height: 300,
                //width: 100,
                flex: 1,
                border: true,
                zIndex: -99999,
                /*items:[
                    {
                        xtype: 'component',
                        html: '<img src="img/car1.ico" height="90" width="90">'
                    },
                    {
                        xtype: 'component',
                        html: '<img src="img/car1-2.ico" height="90" width="90">'
                    }
                ]*/
                controller: 'cartable',
                loader : {
                    url : 'html/carGroup1.html',
                    autoLoad : true,
                    controller: 'cartable',
                    listeners: {
                        scope: 'controller',
                        beforeload: 'beforeLoad',
                        load: 'afterLoad'
                    }
                }
            },
            {
                xtype: 'panel',
                itemId: 'carGroup2',
                title: 'car2',
               // layout: 'vbox',
                height: 300,
                //width: 100,
                flex: 1,
                border: true,
                html: '<img src="img/car2.ico" height="90" width="90" z-index="9999" style= "border:1px solid black;">'


                // items:[
                //     {
                //         xtype: 'component',
                //         zIndex: 999,
                //     }
                // ]
            },
            {
                xtype: 'panel',
                
                id: 'rented',
                title: 'rented',
                //layout: 'vbox',
                height: 300,
                //width: 100,
                flex: 1,
                border: true,
                zIndex: -99999,

                items:[
                    {
                        xtype: 'panel',
                        height: 100,
                        html: 'test text',
                        items:[
                            {
                                xtype: 'component',
                                html: 'test text 2',
                                listeners: {
                                    //scope: 'me.asdf',
                                    afterrender: 'test'
                                }
                            }
                        ]
                    }
                ]

                
            },
            {
                xtype: 'panel',
                itemId: 'repair',
                title: 'repair',
                layout: 'vbox',
                height: 300,
                //width: 100,
                flex: 1,
                border: true,
                zIndex: -99999
            }
        ];

        this.callParent(arguments);
    },

    listeners: {
        afterrender: 'setDD'
    }

});
