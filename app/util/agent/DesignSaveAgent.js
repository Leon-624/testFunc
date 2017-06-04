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
        return this;
    },

    /**
     * @method
     * @returns {Object} containing results and msg from server response
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
            //prepare memento
            var canvasMemento = canvas.getPersistentAttributes(),
                designMemento = null,
                designWriter = new draw2d.io.json.Writer();
            designWriter.marshal(canvas, function(json){
                designMemento = json;
            });
            //assign values into record
            //take care of designParent
            if(record.get('designVersion') == 0)
            {
                record.set('designParent', -1);
            }
            else
            {
                record.set('designParent', record.get('designId'));
            }
            //take care of the rest attributes
            record.set({
                designTitle: this.designContext.getDesignTitle(),
                designDescription: this.designContext.getDesignDescription(),
                designMemento: JSON.stringify(designMemento, null, 2),
                canvasMemento: JSON.stringify(canvasMemento, null, 2),
                designVersion: record.get('designVersion') + 1,
                //designParent: already set above
                designTimestamp: Date.now(),
                designUserId: 'testid'
            });
            //set record to phantom to make it call CREATE api defined in model
            record.phantom = true;
            record.save({
                success: function(){
                    //unmask topView
                    topView.unmask();
                },
                failure: function(){
                    //unmask topView
                    topView.unmask();
                },
                //will be called whether the save succeeded or failed
                callback: function(){
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