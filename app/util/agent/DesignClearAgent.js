/**
 * @class testFunc.util.agents.DesignClearAgent
 * @author  Liyan Xu
 */
Ext.define('testFunc.util.agent.DesignClearAgent', {

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
        return this;
    },

    /**
     * @method
     * reset design: clear canvas, reset canvas attributes, reset title, date, etc.
     * @param {Function} callbackFromLoadAgent execute upon successful saving
     */
     resetDesign: function(){
        //unselect figure
        var canvas = this.getCanvas();
        canvas.fireEvent('select', {figure: null});
        //reset canvas
        canvas.clear();
        canvas.layerRecs = [];
        canvas.nodeCirs = [];
        canvas.selectedFigure = null;
        canvas.defaultWeight = 1;
        canvas.defaultRouter = 'spline';
        canvas.defaultLabelOn = true;
        canvas.updatePolicies();
        //reset global designContext
        this.designContext.setDesignTitle(null);
        this.designContext.setDesignDescription("");
        //reset record
        var record = this.getRecord();
        record.set({
            designId: 0,
            designTitle: 'Untitled Design',
            designDescription: "",
            designMemento: null,
            canvasMemento: null,
            designVersion: 0,
            designParent: 0,
            designTimestamp: "N/A",
            designCreateTimestamp: "N/A (Not Saved)",
            designUserId: null
        });
        //reset title and version info 
        //although design title and version are binded through record,
        //still call this because of potential userContext(userName) change
        var topView = this.getTopView();
        topView.getController().setDesignTitle();
        //reset date
        topView.getController().setDesignDate();
        //reset router
        var splineCheckItem = topView.getController().lookupReference('splineCheckItem');
        splineCheckItem.setChecked(true);
        //mark clean point
        this.designContext.markCleanPoint();
     }

});