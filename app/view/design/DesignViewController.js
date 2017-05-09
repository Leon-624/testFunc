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

    initCanvas: function(){
    	this.canvas = new draw2d.CustomCanvas("gfx_holder");

        this.canvas.installEditPolicy(new draw2d.policy.canvas.ExtendedKeyboardPolicy());
    	this.canvas.installEditPolicy(new draw2d.policy.canvas.CustomFadeoutDecorationPolicy());
        this.canvas.installEditPolicy(new draw2d.policy.canvas.CustomSingleSelectionPolicy);
        this.canvas.installEditPolicy(new draw2d.policy.connection.CustomConnectionCreatePolicy());

		var d = new draw2d.shape.basic.Rectangle({width:50, height:100, x:100, y:100});
		var inputLocator  = new draw2d.layout.locator.InputPortLocator();
		var outputLocator = new draw2d.layout.locator.OutputPortLocator();

		d.createPort("input",inputLocator);
		d.createPort("input",inputLocator);
		d.createPort("output",outputLocator);
		d.createPort("output",outputLocator);

		this.canvas.add(d);
		this.canvas.add(new draw2d.shape.basic.Label({text:"Add ports to the shape with a given locator", x:230, y:60}));

		var d2 = new draw2d.shape.basic.Rectangle({width:50, height:100, x:300, y:150});
		var inputLocator  = new draw2d.layout.locator.InputPortLocator();
		var outputLocator = new draw2d.layout.locator.OutputPortLocator();

		d2.createPort("input",inputLocator);
		d2.createPort("input",inputLocator);
		d2.createPort("output",outputLocator);
		d2.createPort("output",outputLocator);

		this.canvas.add(d2);
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