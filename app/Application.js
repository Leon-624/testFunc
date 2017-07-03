//global variable
var globalContextManager = null;
var globalAgentManager = null;
var globalEventManager = null;

//global namespace
var globalUtil = {};
var globalConst = {};

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
        'testFunc.view.viewport.ViewportTab',
        'testFunc.view.viewport.ViewportTabViewController',

        'testFunc.view.designlist.DesignList',
        'testFunc.view.designlist.DesignListViewController',
        'testFunc.view.designlist.DesignListViewModel',
        'testFunc.model.DesignList',

        'testFunc.view.design.Design',
        'testFunc.view.design.DesignViewController',
        'testFunc.view.design.DesignViewModel',
        'testFunc.model.DesignDetail',

        'testFunc.view.designtitle.DesignTitle',
        'testFunc.view.designtitle.DesignTitleViewController',

        'testFunc.util.manager.GlobalAgentManager',
        'testFunc.util.agent.DesignSaveAgent',
        'testFunc.util.agent.DesignLoadAgent',
        'testFunc.util.agent.DesignClearAgent',
        'testFunc.util.agent.DesignExportAgent',

        'testFunc.util.manager.GlobalEventManager',

        'testFunc.util.manager.GlobalContextManager',
        'testFunc.util.context.DesignContext',
        'testFunc.util.context.UserContext',
        'testFunc.util.context.DesignListContext',

        'testFunc.view.user.UserLogin',
        'testFunc.view.user.UserLoginViewController',
        'testFunc.model.UserLogin',

        'testFunc.view.user.UserSignup',
        'testFunc.view.user.UserSignupViewController',
        'testFunc.model.UserSignup',

        'testFunc.view.help.Help',
        'testFunc.view.help.HelpViewController'

        //'testFunc.view.test.Test',
        //'testFunc.view.test.TestViewModel',
        //'testFunc.model.Test',
        //'testFunc.view.test.TestViewController',
    ],
    
    launch: function () {
        this.preSetup();

        Ext.create('Ext.container.Viewport', {
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
                /*{
                    xtype: 'design',
                    anchor: '100% 100%'
                }*/
                {
                    xtype: 'viewporttab',
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
        globalContextManager = Ext.create('testFunc.util.manager.GlobalContextManager');
        globalAgentManager = Ext.create('testFunc.util.manager.GlobalAgentManager');
        globalEventManager = Ext.create('testFunc.util.manager.GlobalEventManager');
        //set globalUtil namespace
        this._preSetupGlobalUtil();
        //set globalConst namespace
        this._preSetupGlobalConst();
        //set string hash method
        this._preSetupStringHash();
    },

    _preSetupStringHash: function(){
        //from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
        String.prototype.hashCode = function(){
            var hashcode = 0;
            if (this.length == 0) return hashcode;
            for (i = 0; i < this.length; i++) {
                c = this.charCodeAt(i);
                hashcode = ((hashcode<<5)-hashcode)+c;
                hashcode = hashcode & hashcode; // Convert to 32bit integer
            }
            return hashcode;
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

        //format == 1: mm/dd/yy
        //format == 2: hh:mm
        //format == 3: mm/dd/yy hh:mm
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
                var year = dateObj.getFullYear().toString().substr(2,3);
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

        //make a function async by using setTimeout
        globalUtil.async = function(fn, args){
            setTimeout(function(){
                if(args)
                    fn(args);
                else
                    fn();
            }, 10);
        };
    },

    _preSetupGlobalConst: function(){
        globalConst = {
            modelUrl: {
                designDetail: null,
                designList: null,
                userLogin: null
            }
        };
        globalConst.modelUrl.designDetail = {
            create: 'http://localhost:8080/testFuncService/rest/designs/create',
            read: 'http://localhost:8080/testFuncService/rest/designs/retrieve/'
        };
        
        globalConst.modelUrl.designList = {
            read: 'http://localhost:8080/testFuncService/rest/designs/designlist/retrieve/'
        };

        globalConst.modelUrl.userLogin = {
            create: 'http://localhost:8080/testFuncService/rest/auth/validate'
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
