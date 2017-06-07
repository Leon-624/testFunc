//global variable
var globalContext = null;

Ext.myToast = function(text){
    Ext.toast({
        html: text,
        height: 20,
        shadow: true,
        slideInDuration: 500,
        slideBackDuration: 1000,
        bodyStyle: {
            background: '#ffe066'
        }
    });
};

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
        this.preSetup();

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

    preSetup: function(){
        //set globalContext
        globalContext = new testFunc.util.GlobalContext();
        //set string hash method
        this._preSetupStringHash();
    },

    _preSetupStringHash: function(){
        //from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
        String.prototype.hashCode = function(){
            var hash = 0;
            if (this.length == 0) return hash;
            for (i = 0; i < this.length; i++) {
                char = this.charCodeAt(i);
                hash = ((hash<<5)-hash)+char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }
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
