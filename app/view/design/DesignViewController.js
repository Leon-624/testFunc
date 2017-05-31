Ext.define('testFunc.view.design.DesignViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.design',

    onAfterRender: function(){
    	//console.log("Design ViewController onAfterRender Fired");
    },

    onResize: function(){
        //console.log("resize");
    },

    onMsgPanelAfterRender: function(msgPanel){
        this.msgPanel = msgPanel;
        this.msg = "";
    },

    onConfigPanelAfterRender: function(configPanel){
        this.configPanel = configPanel;
        this.weightNumberfield = this.lookupReference('weightNumberfield');
        this.labelCheckbox = this.lookupReference('labelCheckbox');
    },

    onPalettesLoad: function(){
        //console.log("onPalettesLoad Fired");
        this.initCanvas();
        this.initSlider();
    },

    initCanvas: function(){
        this.canvas = new draw2d.CustomCanvas("gfx_holder");
        //this.configPanel is assigned because onConfigPanelAfterRender fires before initCanvas
        this.canvas.setConfigPanel(this.configPanel);
        this.canvas.setMsgPanel(this.msgPanel);
    },

    initSlider: function(){
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
    },

    onDesignSave: function(){
        var writer = new draw2d.io.json.Writer();
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
        });
    },

    onConnStyleMenuClick: function(menu, item){
        if(item)
        {
            this.canvas.updateConnectionRouter(item.value);
        }
    },

    onConfigSave: function(button){
        this.canvas.fireEvent('fromConfigPanel', {
            type: 'setConn',
            weight: this.weightNumberfield.getValue(),
            labelOn: this.labelCheckbox.getValue()
        });
    },

    //handle msg events from canvas
    canvasMsgEventHandler: function(eventObj){
        if(eventObj.type === 'canvasMsg')
        {
            this.msg += ("<li>" + eventObj.msg + "</li>");
            this.msgPanel.setHtml("<ul type='disc'>" + this.msg + "</ul>");
            this.msgPanel.scrollBy(0, 999999);  //always scroll to the bottom
        }
        else
        {
            console.log("canvasMsgEventHandler fired; unknown event type");
        }
    },

    //handle select events from canvas
    canvasSelectEventHandler: function(eventObj){
        if(eventObj.type === 'selectConnection')
        {
            this.weightNumberfield.enable();
            this.weightNumberfield.setValue(eventObj.weight);
            this.labelCheckbox.enable();
            this.labelCheckbox.setValue(eventObj.labelOn);
        }
        else
        {
            this.weightNumberfield.reset();
            this.weightNumberfield.disable();
            this.labelCheckbox.disable();
        }
    }
});