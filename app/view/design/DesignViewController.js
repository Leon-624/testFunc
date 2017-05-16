Ext.define('testFunc.view.design.DesignViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.design',

    onAfterRender: function(){
    	console.log("Design ViewController onAfterRender Fired");
    },

    onPalettesLoad: function(){
        console.log("onPalettesLoad Fired");
        this.initCanvas();
        this.initSlider();
    },

    onSaveClick: function(){
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

    initCanvas: function(){
    	this.canvas = new draw2d.CustomCanvas("gfx_holder");

        this.canvas.installEditPolicy(new draw2d.policy.canvas.ExtendedKeyboardPolicy());
    	this.canvas.installEditPolicy(new draw2d.policy.canvas.CustomFadeoutDecorationPolicy());
        //this.canvas.installEditPolicy(new draw2d.policy.canvas.CustomSingleSelectionPolicy);
        this.canvas.installEditPolicy(new draw2d.policy.connection.CustomConnectionCreatePolicy());
    },

    initSlider: function(){
        var me = this;
        $('#zoomSlider').slider({
            orientation: 'vertical',
            min: 0.2,
            max: 2,
            value: 1,
            step: 0.2,
            slide: function(event, ui){
                me.canvas.setZoom(ui.value, true);
            }
        });
    }

});