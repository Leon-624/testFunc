draw2d.CustomCanvas = draw2d.Canvas.extend({

	NAME: "draw2d.CustomCanvas",

	init: function(id){
		this._super(id);
		this.layerRecs = [];	//array of LayerRectangles
	},

	//override onDrop for dropping elements from outside div
	onDrop: function(droppedDomNode, x, y){
		var shape = $(droppedDomNode).data('shape');
		if(shape === 'rectangle')
		{
			//if (x, y) is inside another LayerRectangle, no action
			var ifInLayer = false, layerLen = this.layerRecs.length;
			for(var i = 0; i < layerLen; ++i)
			{
				if(this.layerRecs[i].hitTest(x, y))
				{
					ifInLayer = true;
					break;
				}
			}
			//(x, y) is inside another layer
			if(ifInLayer)
			{
				console.log('Cannot add layer on top of another layer');
			}
			//(x, y) is not inside another layer
			else
			{
				//let (x, y) be the center of the image
				var imgObj = new draw2d.shape.basic.LayerRectangle();
				var cmd = new draw2d.command.CommandAdd(this, imgObj, x-imgObj.getWidth()/2, y-imgObj.getHeight()/2);
				this.getCommandStack().execute(cmd);
				//add this layer to layerRecs array
				this.layerRecs.push(imgObj);
			}
		}
			
		else if(shape === 'circle')
		{
			var imgObj = new draw2d.shape.basic.NodeCircle();
			//let (x, y) be the center of the image
			var cmd = new draw2d.command.CommandAdd(this, imgObj, x-imgObj.getWidth()/2, y-imgObj.getHeight()/2);
			this.getCommandStack().execute(cmd);
		}
		else
		{
			console.log("Shape is not correct.");
		}
	}

});



draw2d.policy.canvas.CustomFadeoutDecorationPolicy = draw2d.policy.canvas.FadeoutDecorationPolicy.extend({

	NAME: "draw2d.policy.canvas.CustomFadeoutDecorationPolicy",

	//this.DEFAULT_FADEOUT_DURATION controls the time interval to start fading out
	//this.DEFAULT_ALPHA_DECREMENT controls the time interval of actual fading out
	init: function()
    {
        this._super();
        this.alpha = 1.0;
        //override this.DEFAULT_FADEOUT_DURATION to a lower value
        this.DEFAULT_FADEOUT_DURATION = 15;
        this.alphaDec = this.DEFAULT_ALPHA_DECREMENT;
        this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
        this.portDragging = false;
    },

    //need ports always shown when dragging images or ports
    onMouseDrag: function(canvas, dx, dy, dx2, dy2, shiftKey, ctrlKey)
    {
        //if(this.portDragging === false){
            //this.hidePortsCounter=0;
            //this.alphaDec = 0.1;
            //this.onTimer();
        //}
        this.hidePortsCounter = 9999;
    }

});




draw2d.policy.connection.CustomConnectionCreatePolicy = draw2d.policy.connection.ComposedConnectionCreatePolicy.extend({

	NAME: "draw2d.policy.connection.CustomConnectionCreatePolicy",

	init: function(){
		this._super([
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
		]);
	}
});



draw2d.policy.canvas.CustomSingleSelectionPolicy = draw2d.policy.canvas.SingleSelectionPolicy.extend({

	NAME: "draw2d.policy.canvas.CustomSingleSelectionPolicy",

	init: function(){
		this._super();
	},

	//override onClick to bring the clicked figure to the front
	onClick: function(figureClicked, mouseX, mouseY, shiftKey, ctrlKey){
		if(figureClicked != null && figureClicked.name == 'LayerRectangle')
		{
			figureClicked.toBack();
		}
			
	}
});



draw2d.shape.basic.LayerRectangle = draw2d.shape.basic.Rectangle.extend({

	NAME: "draw2d.shape.basic.LayerRectangle",

	init: function(){
		var me = this;
		this._super({
			width: 60,
			height: 200,
			bgColor: '#FFFFC7',
			radius: 10,
			glow: true
		});
		this.name = 'LayerRectangle';
		this.childNodes = [];	//array of NodeCircles inside this layer
	},

	onDragEnd: function(){
		this._super();
		this.toBack();
	}

});


draw2d.shape.basic.NodeCircle = draw2d.shape.basic.Circle.extend({

	NAME: "draw2d.shape.basic.NodeCircle",

	init: function(){
		this._super({
			stroke: 1,
			color: '#000000',
			bgColor: '#00A4D1',
			glow: true
		});
		this.name = 'NodeCircle'; 
		this.parentLayer = null;	//parent LayerRectangle
	}

});




/*draw2d.shape.basic.SiteImg = draw2d.shape.basic.Image.extend({

	NAME : "draw2d.shape.basic.SiteImg",

	init: function(shape){
		this._super({
			path: 'img/schematic/svg/mkt/' + shape + '.svg',
			width: 70,
			height: 70,
			minWidth: 70,
			minHeight: 70
		});

		this.initPort();
	},

	initPort: function(){
		var leftPortLocator = draw2d.layout.locator.PortLocator.extend({
			init: function(){
				this._super();
			},
			relocate: function(index, figure){
				//figure here is port. parent is the actual image.
				var parent = figure.getParent();
				//console.log(figure);
				//console.log(parent);
				this.applyConsiderRotation(figure, 0, parent.getHeight()/2);
			}
		});

		var rightPortLocator = draw2d.layout.locator.PortLocator.extend({
			init: function(){
				this._super();
			},
			relocate: function(index, figure){
				//figure here is actually port. parent is the actual figure.
				var parent = figure.getParent();
				//console.log(figure);
				//console.log(parent);
				this.applyConsiderRotation(figure, parent.getWidth(), parent.getHeight()/2);
			}
		});

		var topPortLocator = draw2d.layout.locator.PortLocator.extend({
			init: function(){
				this._super();
			},
			relocate: function(index, figure){
				//figure here is actually port. parent is the actual figure.
				var parent = figure.getParent();
				//console.log(figure);
				//console.log(parent);
				this.applyConsiderRotation(figure, parent.getWidth()/2, 0);
			}
		});

		var buttomPortLocator = draw2d.layout.locator.PortLocator.extend({
			init: function(){
				this._super();
			},
			relocate: function(index, figure){
				//figure here is actually port. parent is the actual figure.
				var parent = figure.getParent();
				//console.log(figure);
				//console.log(parent);
				this.applyConsiderRotation(figure, parent.getWidth()/2, parent.getHeight());
			}
		});

		this.createPort('hybrid', new leftPortLocator());
		this.createPort('hybrid', new rightPortLocator());
		this.createPort('hybrid', new topPortLocator());
		this.createPort('hybrid', new buttomPortLocator());
	}

});*/