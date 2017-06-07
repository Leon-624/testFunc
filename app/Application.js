//global variable
var globalContext = null;
var globalEventAgent = null;

//global namespace
var globalUtil = {};

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
        'testFunc.view.designtitle.DesignTitle',
        'testFunc.view.designtitle.DesignTitleViewController',
        'testFunc.util.agent.DesignSaveAgent',
        'testFunc.util.agent.DesignLoadAgent',
        'testFunc.util.agent.GlobalEventAgent',
        'testFunc.util.context.GlobalContext',
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
        //set global variables
        globalContext = new testFunc.util.context.GlobalContext();
        globalEventAgent = new testFunc.util.agent.GlobalEventAgent();
        //set globalUtil namespace
        this._preSetupGlobalUtil();
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

    _preSetupGlobalUtil: function(){
        globalUtil.toast = function(text){
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

        //format == 1: mm/dd/yyyy
        //format == 2: hh:mm
        //format == 3: mm/dd/yyyy hh:mm
        globalUtil.convertTsToDate = function(ts, format){
            var dateObj = new Date(ts),
                result = '';
            if(!format)
                format = 3;
            if(format != 2)
            {
                //set month
                var month = (dateObj.getMonth() + 1).toString();
                if(month.length == 1)
                    month = '0' + month;
                //set day
                var day = dateObj.getDate().toString();
                if(day.length == 1)
                    day = '0' + day;
                //set year
                var year = dateObj.getFullYear().toString();
                result += (month + '/' + day + '/' + year);
            }
            if(format != 1)
            {
                if(format == 3)
                    result += ' ';
                //set hour
                var hour = dateObj.getHours().toString();
                if(hour.length == 1)
                    hour = '0' + hour;
                //set minute
                var minute = dateObj.getMinutes().toString();
                if(minute.length == 1)
                    minute = '0' + minute;
                result += (hour + ':' + minute);
            }
            return result;
        };
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
