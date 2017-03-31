Ext.define('testFunc.view.design.DesignViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.design',

    onAfterRender: function(){
    	console.log("Design ViewController onAfterRender Fired");
    	this.initCanvas();
    },

    initCanvas: function(){
    	this.canvas = new draw2d.Canvas("gfx_holder");
    	this.canvas.installEditPolicy(new draw2d.policy.canvas.CoronaDecorationPolicy());
    	this.canvas.installEditPolicy(new draw2d.policy.connection.ComposedConnectionCreatePolicy([
    		new draw2d.policy.connection.DragConnectionCreatePolicy({
    			createConnection: function(){
    				var connection = new draw2d.Connection({
    					stroke: 3,
    					outlineStroke: 1,
    					outlineColor: '#303030',
    					color: '91B93E',
    					router: new draw2d.layout.connection.SplineConnectionRouter()
    				});
    				return connection;
    			}
    		}),
    		new draw2d.policy.connection.ClickConnectionCreatePolicy({
    			/*createConnection: function(){
    				var connection = new draw2d.Connection({
    					stroke: 3,
    					outlineStroke: 1,
    					outlineColor: '#303030',
    					color: '91B93E',
    					router: new draw2d.layout.connection.SplineConnectionRouter()
    				});
    				return connection;
    			}*/
    		})
    	]));

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

    }

});