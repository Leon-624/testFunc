/**
 * @class testFunc.util.agents.DesignSaveAgent
 * @author  Liyan Xu
 */
Ext.define('testFunc.util.agent.DesignSaveAgent', {

	//all config variable can be accessed by getter and setter, but no direct access
    config: {
        canvas: null,   //draw2d.CustomCanvas
        topView: null,  //testFunc.view.design.Design
        record: null    //testFunc.model.Design
    },

    /**
     * @constructor
     */
    constructor: function(config){
        this.initConfig(config);
        this.designContext = globalContext.getDesignContext();
        this.loadMask = null;
        return this;
    },

    /**
     * @method
     */
    saveDesign: function(){
        var canvas = this.getCanvas(),
            topView = this.getTopView(),
            record = this.getRecord();
        //cancel all current selection in canvas
        canvas.fireEvent('select', {figure: null});
        //mask top view
        if(!topView.isMasked())
        {
            topView.mask();
        }
        //if initial design, ask for design title and set in global designContext, then call back
        if(!this.designContext.getDesignTitle())
        {
            //topView will be unmasked by DesignTitleViewController if the title window is cancelled
            this.askDesignTitle();
        }
        //if not initial design or title is set in global designContext, begin saving process
        else
        {
            //if same design, just unmask topView and return
            if(!this.designContext.isDesignDirty())
            {
                topView.unmask();
                Ext.myToast("Design Not Changed");
                return;
            }
            //show loadMask
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
                record.set('designCreateTimestamp', record.get('designTimestamp'));
            //set rest of attributes
            record.set({
                designTitle: this.designContext.getDesignTitle(),
                designDescription: this.designContext.getDesignDescription(),
                designMemento: JSON.stringify(designMemento, null, 2),
                canvasMemento: JSON.stringify(canvasMemento, null, 2),
                designVersion: record.get('designVersion') + 1,
                designParent: 0,
                designParent: record.get('designId'),   //also true for initial design
                //designTimestamp: set above
                //designCreateTimestamp: set above
                designUserId: 'testid'
            });
            //set record to phantom to make it call CREATE api defined in model
            var me = this;
            record.phantom = true;
            record.save({
                success: function(thisRecord, operation){
                    //update record designId
                    var responseObj = JSON.parse(operation.getResponse().responseText);
                    record.set('designId', responseObj.designId);
                    //update design date on topView
                    topView.getController().setDesignDate();
                    //update designContext cleanpoint
                    me.designContext.markCleanPoint();
                    //unmask topView
                    topView.unmask();
                    //destroy loadMask
                    me.loadMask.hide();
                    me.loadMask.destroy();
                    me.loadMask = null;
                    //show toast
                    Ext.myToast('Design Saved');
                },
                failure: function(thisRecord, operation){
                    //unmask topView
                    topView.unmask();
                    //destroy loadMask
                    me.loadMask.hide();
                    me.loadMask.destroy();
                    me.loadMask = null;
                    //show alert
                    Ext.Msg.alert('Failure', "Something is wrong...");
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
     * create a window to ask for title; if title is unique, set title to global designContext,
     * and call back this.saveDesign(); if title is not unique, window gives error msg and waits
     * for another input; if window is cancelled, unmask topView and no callback.
     */
    askDesignTitle: function(){
        //create window asking for title
        var designTitleWindow = Ext.create({
            xtype: 'designtitle',
            topView: this.getTopView(),
            callback: $.proxy(this.saveDesign, this)
        });
    }

});