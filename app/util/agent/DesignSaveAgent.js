/**
 * @class testFunc.util.agents.DesignSaveAgent
 * @author  Liyan Xu
 */
Ext.define('testFunc.util.agent.DesignSaveAgent', {

	//all config variable can be accessed by getter and setter, but no direct access
    config: {
        canvas: null,   //draw2d.CustomCanvas; set by DesignViewController in setDesignAgent method
        topView: null,  //testFunc.view.design.Design; set by DesignViewController in setDesignAgent method
        record: null    //testFunc.model.Design; set by DesignViewController in setDesignAgent method
    },

    /**
     * @constructor
     */
    constructor: function(config){
        this.initConfig(config);
        this.designContext = globalContextManager.getDesignContext();
        this.userContext = globalContextManager.getUserContext();
        this.loadMask = null;
        return this;
    },

    /**
     * @method
     * user must be logged in upon saving
     * @param {Function} callbackFromLoadAgent execute upon successful saving
     */
    saveDesign: function(callbackFromLoadAgent){
        var me = this;
        //check userContext; if not logged in, ask user to login or signup window
        if(!this.userContext.isLoggedIn())
        {
            //make sync call
            globalUtil.async($.proxy(me.askLoginOrSignUp, me));
            return;
        }
        var canvas = this.getCanvas(),
            topView = this.getTopView(),
            record = this.getRecord();
        //cancel all current selection in canvas
        canvas.fireEvent('select', {figure: null});
        //if initial design, ask for design title and set in global designContext, then call back
        if(!this.designContext.getDesignTitle())
        {
            //topView will be masked by DesignTitleViewController when title window is present
            this.askDesignTitle(callbackFromLoadAgent);
        }
        //if not initial design or title is set in global designContext, begin saving process
        else
        {
            //if same design, just return
            if(!this.designContext.isDesignDirty())
            {
                globalUtil.toast("Design Not Changed");
                return;
            }
            //show loadMask; destroy loadMask upon success or failure
            this.loadMask = new Ext.LoadMask({
                msg: 'Saving...',
                target: topView
            });
            this.loadMask.show();
            //prepare memento
            var canvasMemento = canvas.getCanvasMemento(),
                designMemento = canvas.getDesignMemento();
            //assign values into record
            //set designTimestamp and designCreateTimestamp
            record.set('designTimestamp', Date.now());
            if(record.get('designVersion') == 0)
            {
                //can use record.get('designTimestamp')
                //because no field conversion in DesignDetail model
                record.set('designCreateTimestamp', record.get('designTimestamp'));
            }
            //set rest of attributes
            record.set({
                designTitle: this.designContext.getDesignTitle(),
                designDescription: this.designContext.getDesignDescription(),
                designMemento: JSON.stringify(designMemento, null, 2),
                canvasMemento: JSON.stringify(canvasMemento, null, 2),
                designVersion: record.get('designVersion') + 1,
                designParent: record.get('designId'),   //also true for initial design
                //designTimestamp: set above
                //designCreateTimestamp: set above
                designUserId: globalContextManager.getUserContext().getUserId()
            });
            //set record to phantom to make it call CREATE api defined in model
            record.phantom = true;
            //add token into header
            record.getProxy().setHeaders({
                Authorization: 'Bearer ' + this.userContext.getToken()
            });
            record.save({
                success: function(thisRecord, operation){
                    //update record designId
                    var responseObj = JSON.parse(operation.getResponse().responseText);
                    record.set('designId', responseObj.designId);
                    //update design date on topView
                    topView.getController().setDesignDate();
                    //update designContext cleanpoint
                    me.designContext.markCleanPoint();
                    //update record info to designList store through global designListContext
                    globalContextManager.getDesignListContext().updateRecord(record);
                    //destroy loadMask
                    me.loadMask.hide();
                    me.loadMask.destroy();
                    me.loadMask = null;
                    //show toast
                    globalUtil.toast("Design Saved");
                    //show msg on msgPanel
                    globalEventManager.makeEvent("msgPanel", 'msg', {
                        type: 'saveAgentMsg',
                        msg: 'Design saved as version ' + record.get('designVersion') + '.'
                    });
                    //execute callbackFromLoadAgent
                    if(callbackFromLoadAgent)
                    {
                        callbackFromLoadAgent();
                    }
                },
                failure: function(thisRecord, operation){
                    //destroy loadMask
                    me.loadMask.hide();
                    me.loadMask.destroy();
                    me.loadMask = null;
                    //show alert
                    Ext.Msg.alert('Failure', "Something is wrong...");
                    //show msg on msgPanel
                    globalEventManager.makeEvent("msgPanel", 'msg', {
                        type: 'saveAgentMsg',
                        msg: 'Something is wrong trying to save...'
                    });
                },
                //will be called whether the save succeeded or failed
                callback: function(thisRecord, operation, success){
                    //no action
                }
            });

        }
    },

    /**
     * @method
     * create a window to ask for title, mask topview; if title is unique, set title to global designContext,
     * and call back this.saveDesign(), unmask topview; if title is not unique, window gives error msg and waits
     * for another input; if window is cancelled, unmask topView and no callback.
     * add args for saveDesign callbackFromLoadAgent
     */
    askDesignTitle: function(callbackFromLoadAgent){
        var me = this;
        //create window asking for title
        var designTitleWindow = Ext.create({
            xtype: 'designtitle',
            topView: this.getTopView(),
            callback: $.proxy(function(){
                me.saveDesign(callbackFromLoadAgent);
            }, me)
        });
    },

    askLoginOrSignUp: function(){
        var me = this;
        Ext.Msg.show({
            title:'User Identity',
            message: 'You need to log in to save the design. Would you like to log in?',
            buttons: Ext.Msg.YESNOCANCEL,
            buttonText: {
                yes: 'Log In',
                no: 'Sign Up',
                cancel: 'Cancel'
            },
            icon: Ext.Msg.QUESTION,
            fn: function(btn){
                //open login window
                if(btn === 'yes')
                {
                    globalUtil.async(Ext.create, {
                        xtype: 'userlogin',
                        topView: Ext.ComponentQuery.query('viewporttab')[0],
                        callback: $.proxy(me.saveDesign, me)
                    });
                }
                //open signup window
                else if(btn === 'no')
                {
                    globalUtil.async(Ext.create, {
                        xtype: 'usersignup',
                        topView: Ext.ComponentQuery.query('viewporttab')[0],
                        callback: $.proxy(me.saveDesign, me)
                    });
                }
                //cancel
                else
                {
                    //no action
                }
            }
        });
    }

});