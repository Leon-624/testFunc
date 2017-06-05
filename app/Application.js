//global variable
var globalContext = null;

/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('testFunc.Application', {
    extend: 'Ext.app.Application',
    
    appFolder: './app',

    /*views:[
        'AccountManager.view.user.List'
    ],*/
    /*stores:[
        "Users"
    ],*/
    requires: [
        'testFunc.view.design.Design',
        'testFunc.view.design.DesignViewController',
        'testFunc.view.design.DesignViewModel',
        'testFunc.model.DesignDetail',
        'testFunc.view.window.DesignTitle',
        'testFunc.view.window.DesignTitleViewController',
        'testFunc.util.agent.DesignSaveAgent',
        'testFunc.util.agent.DesignLoadAgent',
        'testFunc.util.GlobalContext',
        'testFunc.util.context.DesignContext'
        //'testFunc.view.test.Test',
        //'testFunc.view.test.TestViewModel',
        //'testFunc.model.Test',
        //'testFunc.view.test.TestViewController',
    ],
    
    launch: function () {
        //set globalContext
        globalContext = new testFunc.util.GlobalContext();

        Ext.create('Ext.container.Viewport', {
            //layout: 'vbox',
            autoScroll: true,
            layout: 'anchor',
            items: [
                /*{
                    xtype: 'panel',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'userlist',
                            flex: 2,
                            height: 300
                        },
                        {
                            xtype: 'userform',
                            flex: 1,
                            height: 300
                        }
                    ]
                },*/
                /*{
                    xtype: 'test',
                    anchor: '100% 100%'
                },*/
                {
                    xtype: 'design',
                    anchor: '100% 100%'
                }
                /*{
                    xtype: 'pie3d'
                }*/
                
                /*{
                    xtype: 'cartable'
                    //height: 300
                }*/
            ]
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
