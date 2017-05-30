Ext.define('testFunc.view.design.DesignViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.design',

    onAfterRender: function(){
    	//console.log("Design ViewController onAfterRender Fired");
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
            type: 'setWeight',
            weight: this.weightNumberfield.getValue()
        });
    },

    //handle events from canvas
    fromCanvasEventHandler: function(eventObj){
        if(eventObj.type === 'selectConnection')
        {
            this.weightNumberfield.enable();
            this.weightNumberfield.setValue(eventObj.weight);
        }
        else
        {
            this.weightNumberfield.reset();
            this.weightNumberfield.disable();
        }
    }
});