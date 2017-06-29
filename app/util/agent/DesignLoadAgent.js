/**
 * @class testFunc.util.agents.DesignLoadAgent
 * @author  Liyan Xu
 */
Ext.define('testFunc.util.agent.DesignLoadAgent', {

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
        this.loadMask = null;
        this.designIdToBeLoaded = null;     //update in loadDesign
        return this;
    },

    /**
     * @method
     */
    loadDesign: function(designId){
        //if designId is passed (by DesignListViewController), set this.designIdToBeLoaded
        if(designId !== undefined)
        {
            this.designIdToBeLoaded = designId;
        }
        //if designId is not passed (by askUnsavedDesign() or saveDesign() in saveAgent), set designId
        else
        {
            designId = this.designIdToBeLoaded;
        }
        //if current design is dirty, ask if save design first
        if(this.designContext.isDesignDirty())
        {
            this.askUnsavedDesign();
        }
        else
        {
            //special case: designId is 0, reset design
            if(designId === 0)
            {
                globalAgentManager.getDesignClearAgent().resetDesign();
                //show msg on msgPanel
                globalEventManager.makeEvent("msgPanel", 'msg', {
                        type: 'clearMsg'
                });
                globalEventManager.makeEvent("msgPanel", 'msg', {
                    type: 'loadAgentMsg',
                    msg: 'Design is reset.'
                });
                return;
            }
            //load testFunc.model.DesignDetail
            var record = this.getRecord(),
                canvas = this.getCanvas(),
                me = this;
            record.getProxy().getApi().read = globalConst.modelUrl.designDetail.read + designId;
            record.load({
                success: function(thisRecord, operation){
                    //clear canvas figures
                    canvas.fireEvent('select', {figure: null});
                    canvas.clear();
                    //read memento into canvas
                    canvas.setPersistentAttributes(JSON.parse(record.get('canvasMemento')));
                    var figureTsMap = {
                        nodeMap: {},
                        layerMap: {}
                    };
                    var reader = new draw2d.io.json.CustomReader();
                    reader.unmarshal(canvas, record.get('designMemento'), figureTsMap);
                    //complete setting custom attributes of figures
                    var figures = canvas.getFigures();
                    figures.each(function(index, value){
                        if(value.name === 'NodeCircle')
                        {
                            var parentTs = value.parentLayer;
                            value.parentLayer = figureTsMap.layerMap[parentTs];
                        }
                        else if(value.name === 'LayerRectangle')
                        {
                            for(var i = 0; i < value.childNodes.length; ++i)
                            {
                                var childTs = value.childNodes[i];
                                value.childNodes[i] = figureTsMap.nodeMap[childTs];
                            }
                        }
                        else
                        {
                            console.log("Load Agent: Unknown Figure Name: " + value.name);
                        }
                    });
                    //complete setting custom attributes of canvas
                    for(var i = 0; i < canvas.layerRecs.length; ++i)
                    {
                        var layerTs = canvas.layerRecs[i];
                        canvas.layerRecs[i] = figureTsMap.layerMap[layerTs];
                    }
                    for(var i = 0; i < canvas.nodeCirs.length; ++i)
                    {
                        var nodeTs = canvas.nodeCirs[i];
                        canvas.nodeCirs[i] = figureTsMap.nodeMap[nodeTs];
                    }
                    canvas.uninstallEditPolicy(canvas.customConnCreatePolicy);
                    canvas.customConnCreatePolicy = new draw2d.policy.connection.CustomConnectionCreatePolicy
                        (canvas.defaultWeight, canvas.defaultRouter, canvas.defaultLabelOn, $.proxy(canvas.sendMsgToMsgPanel, canvas));
                    canvas.installEditPolicy(canvas.customConnCreatePolicy);
                    //set global designContext
                    var designContext = globalContextManager.getDesignContext();
                    designContext.setDesignTitle(record.get('designTitle'));
                    designContext.setDesignDescription(record.get('designDescription'));
                    //reset date
                    var topView = me.getTopView();
                    topView.getController().setDesignDate();
                    //reset router
                    var routerCheckItem = topView.getController().lookupReference(canvas.defaultRouter + 'CheckItem');
                    routerCheckItem.setChecked(true);
                    //mark clean point
                    designContext.markCleanPoint();
                    //show msg on msgPanel
                    globalEventManager.makeEvent("msgPanel", 'msg', {
                        type: 'clearMsg'
                    });
                    globalEventManager.makeEvent("msgPanel", 'msg', {
                        type: 'loadAgentMsg',
                        msg: 'Design ' + record.get('designTitle') + ' is loaded.'
                    });
                },
                failure: function(thisRecord, operation){
                    Ext.Msg.alert("Loading Error", "Soomething is wrong...");
                },
                //will be called whether the save succeeded or failed
                callback: function(thisRecord, operation, success){
                    //no action
                }
            });
            
        }
    },

    askUnsavedDesign: function(){
        var me = this;
        Ext.Msg.show({
            title:'Save Changes?',
            message: 'You have unsaved changes. Would you like to save your changes first?',
            buttons: Ext.Msg.YESNOCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn){
                me._proceedAskUnsavedDesignFeedback(btn);
            }
        });
    },

    _proceedAskUnsavedDesignFeedback: function(btn){
        //click yes, save design first, then callback loadDesign(designId)
        if(btn === 'yes')
        {
            var me = this;
            var saveAgent = globalAgentManager.getDesignSaveAgent();
            //need to make async call, otherwise 'Save Changes' window will not close
            globalUtil.async($.proxy(saveAgent.saveDesign, saveAgent),
                                $.proxy(me.loadDesign, me));
        }
        //click no, mark current design clean point, then callback loadDesign(designId)
        else if(btn === 'no')
        {
            this.designContext.markCleanPoint();
            this.loadDesign();
        }
        //click cancel, no saving or loading action
        else
        {
            //no action
        }
    }
});