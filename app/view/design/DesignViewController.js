Ext.define('testFunc.view.design.DesignViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.design',

    /*
    * Render Sequence When Design Tab Is Not Active Initially:
    * onPalettesLoad -(design tab activated)-> onMsgPanelAfterRender -> selectedConfigPanel
    * -> onAfterRender -(glocal config tab activated)-> onGlobalConfigAfterRender
    *
    * Render Sequence When Design Tab Is Active Initially:
    * onMsgPanelAfterRender -> onSelectedConfigAfterRender -> onPalettesLoad
    * -(glocal config tab activated)-> onGlobalConfigAfterRender
    */
    
    onAfterRender: function(){
        this.initCanvas();
        this.designTitleCmpt = this.lookupReference('designTitleCmpt');
        //register design view to userContext, as userContext affects its appearance;
        //upon user context changes, userContext will notify registered components
        this.userContext = globalContextManager.getUserContext();
        this.userContext.register(this.getView());
    },

    onUserContextChange: function(){
        //if user logs in: reset design title
        if(this.userContext.isLoggedIn())
        {
            //reset designTitle
            this.setDesignTitle();
        }
        //if user logs out
        else
        {
            //reset design
            this.loadAgent.loadDesign(0);
        }

    },

    onResize: function(){
        //console.log("resize");
    },

    onMsgPanelAfterRender: function(msgPanel){
        this.msgPanel = msgPanel;
        this.msg = "";
        //register msgPanel to globalEventManager
        globalEventManager.register('msgPanel', this.msgPanel);
    },

    onGlobalConfigAfterRender: function(globalConfigPanel){
        this.globalConfigPanel = globalConfigPanel;
        this.defaultWeightNumberfield = this.lookupReference('defaultWeightNumberfield');
        //register globalConfigPanel to globalEventManager
        globalEventManager.register('globalConfigPanel', this.globalConfigPanel);
    },

    //default active tab
    onSelectedConfigAfterRender: function(selectedConfigPanel){
        this.selectedConfigPanel = selectedConfigPanel;
        this.weightNumberfield = this.lookupReference('weightNumberfield');
        this.labelCheckbox = this.lookupReference('labelCheckbox');
        this.hiddenTextfield = this.lookupReference('hiddenTextfield');
        this.configTab = this.lookupReference('configTab');
        //register selectedConfigPanel to globalEventManager
        globalEventManager.register('selectedConfigPanel', this.selectedConfigPanel);
    },

    onPalettesLoad: function(){
        //this.initCanvas();
        //this.initSlider();
    },

    //initialization sequence matters!
    initCanvas: function(){
        this.canvas = new draw2d.CustomCanvas("gfx_holder");
        //set design model instance from viewModel
        //console.log(this.getViewModel().getData().design.getProxy()); //Ghost?!!
        this.record = this.getViewModel().getData().design;
        this.record.getProxy().getApi().create = globalConst.modelUrl.designDetail.create;
        this.record.getProxy().getApi().read = globalConst.modelUrl.designDetail.read;
        //set design date
        this.setDesignDate();
        //set global designContext
        this.setDesignContext();
        //set global design save/load agents
        this.setDesignAgent();
        //register canvas to globalEventManager
        globalEventManager.register('canvas', this.canvas);
    },

    setDesignContext: function(){
        this.designContext = globalContextManager.getDesignContext();
        this.designContext.setCanvas(this.canvas);
        this.designContext.markCleanPoint();
    },

    setDesignAgent: function(){
        //set saveAgent
        this.saveAgent = globalAgentManager.getDesignSaveAgent();
        this.saveAgent.setCanvas(this.canvas);
        this.saveAgent.setTopView(this.getView());
        this.saveAgent.setRecord(this.getViewModel().getData().design);
        //set loadAgent
        this.loadAgent = globalAgentManager.getDesignLoadAgent();
        this.loadAgent.setCanvas(this.canvas);
        this.loadAgent.setTopView(this.getView());
        this.loadAgent.setRecord(this.getViewModel().getData().design);
        //set clearAgent
        this.clearAgent = globalAgentManager.getDesignClearAgent();
        this.clearAgent.setCanvas(this.canvas);
        this.clearAgent.setTopView(this.getView());
        this.clearAgent.setRecord(this.getViewModel().getData().design);
        //set exportAgent
        this.exportAgent = globalAgentManager.getDesignExportAgent();
        this.exportAgent.setCanvas(this.canvas);
    },

    setDesignTitle: function(){
        this.designTitleCmpt.setHtml(this.record.get('designTitle') + '<br>Ver. '
            + this.record.get('designVersion') + ' - ' + this.userContext.getUserName());
    },

    //set design date according to model instance designTimestamp
    setDesignDate: function(){
        var record = this.record,
            modifiedTs  = record.get('designTimestamp'),
            createdTs = record.get('designCreateTimestamp'),
            dateCmpt = this.lookupReference('designDate');
        if(typeof(modifiedTs) == 'string')
        {
            dateCmpt.setHtml("Modified: " + modifiedTs + "<br>Created: " + createdTs);
        }
        else
        {
            var modifiedDate = globalUtil.convertTsToDate(modifiedTs, 3),
                createdDate = globalUtil.convertTsToDate(createdTs, 3);
            dateCmpt.setHtml("Modified: " + modifiedDate + "<br>Created: " + createdDate);
        }
    },

    //JQuery-UI slider
    /*initSlider: function(){
        var me = this;
        $('#zoomSlider').slider({
            orientation: 'vertical',
            min: 0.1,
            max: 5,
            value: 1,
            step: 0.1,
            slide: function(event, ui){
                me.canvas.setZoom(ui.value, true);
                //console.log("Set zoom factor: " + ui.value);
            }
        });
    },*/

    onZoomSliderChange: function(slider, newValue){
        this.canvas.setZoom(newValue/10, true);
    },

    onDesignSave: function(){
        this.saveAgent.saveDesign();

        /*var writer = new draw2d.io.json.Writer();
        writer.marshal(this.canvas, function(designJson){
            var jsonToPost = {
                designId: -1,
                designTitle: 'test title',
                designDescription: 'test description',
                designJson: JSON.stringify(designJson),
                designVersion: 1,
                designParent: -1,
                designTimestamp: Date.now(),
                designUserId: 'testid'
            };
            var jsonText = JSON.stringify(jsonToPost, null, 2);
            //ajax call to post json
            Ext.Ajax.request({
                url: 'http://localhost:8080/testFuncService/rest/designs/create',
                method: 'POST',
                jsonData: jsonText,
                proxy:{
                    reader: {
                        type: 'json',
                        successProperty: 'success'
                    }
                },
                success: function(response, opts) {
                    //Ext.decode() takes Json and parses
                    var obj = Ext.decode(response.responseText);
                    Ext.Msg.alert('Success', obj.msg);
                },
                failure: function(response, opts) {
                    var obj = Ext.decode(response.responseText);
                    Ext.Msg.alert('Failed', obj.error);
                }
            });
        });*/
    },

    onNewDesignClick: function(){
        this.loadAgent.loadDesign(0);
    },

    onActionsMenuClick: function(menu, item){
        if(item)
        {
            if(item.value === 'png')
            {
                this.exportAgent.exportPng();
            }
        }
    },

    onConnStyleMenuClick: function(menu, item){
        if(item)
        {
            this.canvas.updateConnectionRouter(item.value);
        }
    },

    onGlobalConfigSave: function(button){
        if(globalEventManager.isRegistered('canvas'))
        {
            globalEventManager.makeEvent("canvas", 'fromGlobalConfigPanel', {
                type: 'setGlobalConfig',
                defaultWeight: this.defaultWeightNumberfield.getValue()
            });
        }
        else
        {
            console.log("canvas hasn't registered itself to globalEventManager.");
        }
    },

    onSelectedConfigSave: function(button){
        if(globalEventManager.isRegistered('canvas'))
        {
            globalEventManager.makeEvent("canvas", 'fromSelectedConfigPanel', {
                type: 'setConn',
                weight: this.weightNumberfield.getValue(),
                labelOn: this.labelCheckbox.getValue()
            });
        }
        else
        {
            console.log("canvas hasn't registered itself to globalEventManager.");
        }
    },

    //handle msg events from outside
    msgEventHandler: function(eventObj){
        if(eventObj.type === 'canvasMsg' || eventObj.type === 'saveAgentMsg' || eventObj.type === 'loadAgentMsg')
        {
            this.msg += ("<li>" + eventObj.msg + "</li>");
            this.msgPanel.setHtml("<ul type='disc'>" + this.msg + "</ul>");
            this.msgPanel.scrollBy(0, 999999);  //always scroll to the bottom
        }
        else if(eventObj.type === 'clearMsg')
        {
            this.msg = "";
            this.msgPanel.setHtml("");
        }
        else
        {
            console.log("msgEventHandler fired; unknown event type");
        }
    },

    //handle select events from canvas
    canvasSelectEventHandler: function(eventObj){
        if(eventObj.type === 'selectConnection')
        {
            this.configTab.setActiveTab(1);
            this.weightNumberfield.enable();
            this.weightNumberfield.setValue(eventObj.weight);
            this.labelCheckbox.enable();
            this.labelCheckbox.setValue(eventObj.labelOn);
            //disable hidden field to disable its validation
            this.hiddenTextfield.disable();
        }
        else
        {
            this.weightNumberfield.reset();
            this.weightNumberfield.disable();
            this.labelCheckbox.setValue(false);
            this.labelCheckbox.disable();
            //enable hidden field to enable its validation
            this.hiddenTextfield.enable();
        }
    }
});