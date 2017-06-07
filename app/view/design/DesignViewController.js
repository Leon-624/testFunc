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

    //not the default active tab; fires after selecting global config tab, after onPalettesLoad
    onGlobalConfigAfterRender: function(globalConfigPanel){
        this.globalConfigPanel = globalConfigPanel;
        this.defaultWeightNumberfield = this.lookupReference('defaultWeightNumberfield');
        this.canvas.setGlobalConfigPanel(this.globalConfigPanel);
    },

    //default active tab; fires before onPalettesLoad
    onSelectedConfigAfterRender: function(selectedConfigPanel){
        this.selectedConfigPanel = selectedConfigPanel;
        this.weightNumberfield = this.lookupReference('weightNumberfield');
        this.labelCheckbox = this.lookupReference('labelCheckbox');
        this.hiddenTextfield = this.lookupReference('hiddenTextfield');
        this.configTab = this.lookupReference('configTab');
    },

    //fires after onSelectedConfigAfterRender, before onGlobalConfigAfterRender
    onPalettesLoad: function(){
        //console.log("onPalettesLoad Fired");
        this.initCanvas();
        //this.initSlider();
    },

    initCanvas: function(){
        this.canvas = new draw2d.CustomCanvas("gfx_holder");
        //this.configPanel is initialized because onConfigPanelAfterRender fires before initCanvas
        this.canvas.setSelectedConfigPanel(this.selectedConfigPanel);
        this.canvas.setMsgPanel(this.msgPanel);
        //set design model instance from viewModel
        this.record = this.getViewModel().getData().design;
        //set design date
        this.setDesignDate();
        //set global designContext (pass canvas instance)
        this.designContext = globalContext.getDesignContext();
        this.designContext.setCanvas(this.canvas);
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
            var modifiedDate = this._convertTsToDate(modifiedTs, 3),
                createdDate = this._convertTsToDate(createdTs, 1);
            dateCmpt.setHtml("Modified: " + modifiedDate + "<br>Created: " + createdDate);
        }
    },

    //format == 1: mm/dd/yyyy
    //format == 2: hh:mm
    //format == 3: mm/dd/yyyy hh:mm
    _convertTsToDate: function(ts, format){
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
            var year = dateObj.getFullYear().toString();
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
        var saveAgent = Ext.create('testFunc.util.agent.DesignSaveAgent', {
            canvas: this.canvas,
            topView: this.getView(),
            record: this.getViewModel().getData().design
        });
        saveAgent.saveDesign();

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

    onConnStyleMenuClick: function(menu, item){
        if(item)
        {
            this.canvas.updateConnectionRouter(item.value);
        }
    },

    onSelectedConfigSave: function(button){
        this.canvas.fireEvent('fromSelectedConfigPanel', {
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