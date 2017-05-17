/**
 * @class myDraw2d
 * global namespace declarations
 */
var myDraw2d = 
{
    shapeDesc: {
    }
};

/**
 * @class draw2d.CustomCanvas
 * @author  Liyan Xu
 * @extends draw2d.Canvas
 */
draw2d.CustomCanvas = draw2d.Canvas.extend({

	NAME: "draw2d.CustomCanvas",

	/**
     * @constructor 
     */
	init: function(id){
		this._super(id);
		this.layerRecs = [];	//array of LayerRectangles
		this.nodeCirs = [];		//array of NodeCircles
		this.util = new myDraw2d.Util();
	},

	/**
     * @override
     * override onDrop for dropping elements from outside div
     */
	onDrop: function(droppedDomNode, x, y){
		var shape = $(droppedDomNode).data('shape');
		if(shape === 'rectangle')
		{
			var layerDesc = new myDraw2d.shapeDesc.LayerRectangle(
				x, y, this.util.DEFAULT_WIDTH_RECTANGLE, this.util.DEFAULT_HEIGHT_RECTANGLE);
			var centerPos = this.util.decideLayerCenterPos(layerDesc, this.layerRecs, this.nodeCirs);
			//if not overlaps with other LayerRectangles or NodeCircles, or can avoid by shifting, create layer
			if(centerPos)
			{
				var imgObj = new draw2d.shape.basic.LayerRectangle(this.util);
				var cmd = new draw2d.command.CommandAdd(this, imgObj,
					centerPos.getX()-imgObj.getWidth()/2, centerPos.getY()-imgObj.getHeight()/2);
				this.getCommandStack().execute(cmd);
				//add this layer to layerRecs array
				this.layerRecs.push(imgObj);
			}
			//if cannot avoid overlap with other LayerRectangles or NodeCircles, no action
			else
			{
				console.log("Cannot add overlapped layer");
			}
		}
		else if(shape === 'circle')
		{
			//let (x, y) be the center of the image
			var imgObj = new draw2d.shape.basic.NodeCircle(this.util);
			var cmd = new draw2d.command.CommandAdd(this, imgObj, x-imgObj.getWidth()/2, y-imgObj.getHeight()/2);
			this.getCommandStack().execute(cmd);
			//add this node to nodeCirs array
			this.nodeCirs.push(imgObj);
		}
		else
		{
			console.log("Shape is not correct.");
		}
	}

});


/**
 * @class draw2d.policy.canvas.CustomFadeoutDecorationPolicy
 * @author  Liyan Xu
 * @extends draw2d.policy.canvas.FadeoutDecorationPolicy
 */
draw2d.policy.canvas.CustomFadeoutDecorationPolicy = draw2d.policy.canvas.FadeoutDecorationPolicy.extend({

	NAME: "draw2d.policy.canvas.CustomFadeoutDecorationPolicy",

	/**
     * @constructor 
     */
	init: function()
    {
        this._super();
        this.alpha = 1.0;
        //this.DEFAULT_FADEOUT_DURATION controls the time interval to start fading out
		//this.DEFAULT_ALPHA_DECREMENT controls the time interval of actual fading out
        //override this.DEFAULT_FADEOUT_DURATION to a lower value
        this.DEFAULT_FADEOUT_DURATION = 15;
        this.alphaDec = this.DEFAULT_ALPHA_DECREMENT;
        this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
        this.portDragging = false;
    },

    /**
     * @override
     * need ports always shown when dragging images or ports
     */
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



/**
 * @class draw2d.policy.connection.CustomConnectionCreatePolicy
 * @author  Liyan Xu
 * @extends draw2d.policy.connection.ComposedConnectionCreatePolicy
 */
draw2d.policy.connection.CustomConnectionCreatePolicy = draw2d.policy.connection.ComposedConnectionCreatePolicy.extend({

	NAME: "draw2d.policy.connection.CustomConnectionCreatePolicy",

	/**
     * @constructor 
     */
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


/**
 * @class draw2d.policy.canvas.CustomSingleSelectionPolicy
 * @author  Liyan Xu
 * @extends draw2d.policy.canvas.SingleSelectionPolicy
 */
draw2d.policy.canvas.CustomSingleSelectionPolicy = draw2d.policy.canvas.SingleSelectionPolicy.extend({

	NAME: "draw2d.policy.canvas.CustomSingleSelectionPolicy",

	/**
     * @constructor
     */
	init: function(){
		this._super();
	},

	/**
     * @override
     * override onClick to bring the clicked figure to the front
     */
	onClick: function(figureClicked, mouseX, mouseY, shiftKey, ctrlKey){
		if(figureClicked != null && figureClicked.name == 'LayerRectangle')
		{
			figureClicked.toBack();
		}
			
	}
});


/**
 * @class draw2d.shape.basic.LayerRectangle
 * @author  Liyan Xu
 * @extends draw2d.shape.basic.Rectangle
 */
draw2d.shape.basic.LayerRectangle = draw2d.shape.basic.Rectangle.extend({

	NAME: "draw2d.shape.basic.LayerRectangle",

	/**
     * @constructor
     * @param {myDraw2d.Util}
     */
	init: function(util){
		this._super({
			width: util.DEFAULT_WIDTH_RECTANGLE,
			height: util.DEFAULT_HEIGHT_RECTANGLE,
			bgColor: '#FFFFC7',
			radius: 10,
			glow: true
		});
		this.name = 'LayerRectangle';
		this.childNodes = [];	//array of NodeCircles inside this layer
	},

	/**
     * @override
     * override onDragEnd to bring the layer to the back
     */
	onDragEnd: function(){
		this.toBack();
		this._super();
	},

	/**
     * @method
     * @returns {draw2d.geo.Point} the center point of LayerRectangle
     */
	getCenterPos: function(){
		return new draw2d.geo.Point(this.x + this.width/2, this.y + this.height/2);
	}

});

/**
 * @class draw2d.shape.basic.NodeCircle
 * @author  Liyan Xu
 * @extends draw2d.shape.basic.Circle
 */
draw2d.shape.basic.NodeCircle = draw2d.shape.basic.Circle.extend({

	NAME: "draw2d.shape.basic.NodeCircle",

	/**
     * @constructor
     * @param {myDraw2d.Util}
     */
	init: function(util){
		this._super({
			diameter: util.DEFAULT_RADIUS_CIRCLE * 2,
			stroke: 1,
			color: '#000000',
			bgColor: '#00A4D1',
			glow: true
		});
		this.name = 'NodeCircle'; 
		this.parentLayer = null;	//parent LayerRectangle
	},

	/**
     * @override
     * override onDragStart to bring the node to the front;
     */
	onDragStart: function(){
		this.toFront();
		this._super();
	},

	/**
     * @method
     * @returns {draw2d.geo.Point} the center point of NodeCircle
     */
	getCenterPos: function(){
		return new draw2d.geo.Point(this.x + this.width, this.y + this.width);
	}

});


/**
 * @class myDraw2d.Util
 * @author  Liyan Xu
 */
myDraw2d.Util = Class.extend({
    
	NAME: "myDraw2d.Util",

	/**
     * @constructor
     */
	init: function(){
		this.DEFAULT_WIDTH_RECTANGLE = 60;
		this.DEFAULT_HEIGHT_RECTANGLE = 200;
		this.DEFAULT_RADIUS_CIRCLE = 20;
	},

	/**
     * @method
     * @param {myDraw2d.shapeDesc.LayerRectangle} layer
     * @param {array} layerRecs, nodeCirs properties of CustomCanvas
     * @returns {draw2d.geo.Point} or {null}
     (a) Return original center position if it doesn't overlap with another LayerRectangle
	 or any NodeCircle.
	 (b) Return null if it doesn't overlap with another LayerRectangle, but overlaps with
	 any NodeCircle.
	 (c) Return re-calculated center position if it overlaps with another LayerRectangle,
	 but can be shifted to avoid overlap with any LayerRectangle or NodeCircle.
	 (only do x-axis shifting since layers are usually arranged horizontally.)
	 (d) Return null if after shifting it still overlaps with any LayerRectangle or NodeCircle.
     */
	decideLayerCenterPos: function(layer, layerRecs, nodeCirs){
		var firstOvlpLayerDesc = null,
			layerLen = layerRecs.length,
			nodeLen = nodeCirs.length;
		for(var i = 0; i < layerLen; ++i)
		{
			var currLayer = layerRecs[i];
			var currLayerDesc = new myDraw2d.shapeDesc.LayerRectangle(
				currLayer.getX() + currLayer.getWidth()/2,
				currLayer.getY() + currLayer.getHeight()/2,
				currLayer.getWidth(),
				currLayer.getHeight());
			if(this.ifLayersOverlap(layer, currLayerDesc))
			{
				firstOvlpLayerDesc = currLayerDesc;
				break;
			}
		}
		//there is no overlapped LayerRectangle
		if(firstOvlpLayerDesc === null)
		{
			var ifOverlapNode = false;
			for(var i = 0; i < nodeLen; ++i)
			{
				var currNode = nodeCirs[i];
				var currNodeDesc = new myDraw2d.shapeDesc.NodeCircle(
					currNode.getX() + currNode.getDiameter()/2,
					currNode.getY() + currNode.getDiameter()/2,
					currNode.getDiameter()/2);
				if(this.ifLayerOverlapNode(layer, currNodeDesc))
				{
					ifOverlapNode = true;
					break;
				}
			}
			//there exists overlapped NodeCircle, return null
			if(ifOverlapNode)
			{
				console.log("no overlapped LayerRectangle but overlapped NodeCircle");
				return null;
			}
			//there is no overlapped NodeCircle, return original center position
			else
			{
				console.log("no overlapped LayerRectangle or NodeCircle");
				return new draw2d.geo.Point(layer.centerX, layer.centerY);
			}
		}
		//there exists overlapped LayerRectangle
		else
		{
			var offset = null;
			if(layer.centerX > firstOvlpLayerDesc.centerX)
				offset = layer.width/2 + firstOvlpLayerDesc.width/2 - (layer.centerX - firstOvlpLayerDesc.centerX) + 5;
			else
				offset = (firstOvlpLayerDesc.centerX - layer.centerX) - (layer.width/2 + firstOvlpLayerDesc.width/2) - 5;
			console.log("center pos before applying offset: " + layer.centerX + ", " + layer.centerY);
			//apply offset to shift
			layer.centerX += offset;
			console.log("center pos after applying offset: " + layer.centerX + ", " + layer.centerY);
			firstOvlpLayerDesc = null;
			for(var i = 0; i < layerLen; ++i)
			{
				var currLayer = layerRecs[i];
				var currLayerDesc = new myDraw2d.shapeDesc.LayerRectangle(
					currLayer.getX() + currLayer.getWidth()/2,
					currLayer.getY() + currLayer.getHeight()/2,
					currLayer.getWidth(),
					currLayer.getHeight());
				if(this.ifLayersOverlap(layer, currLayerDesc))
				{
					firstOvlpLayerDesc = currLayerDesc;
					break;
				}
			}
			//if still overlaps with other LayerRectangle, return null
			if(firstOvlpLayerDesc)
			{
				console.log("after shifting still overlaps with LayerRectangles");
				return null;
			}
			var ifOverlapNode = false;
			for(var i = 0; i < nodeLen; ++i)
			{
				var currNode = nodeCirs[i];
				var currNodeDesc = new myDraw2d.shapeDesc.NodeCircle(
					currNode.getX() + currNode.getDiameter()/2,
					currNode.getY() + currNode.getDiameter()/2,
					currNode.getDiameter()/2);
				if(this.ifLayerOverlapNode(layer, currNodeDesc))
				{
					ifOverlapNode = true;
					break;
				}
			}
			//there exists overlapped NodeCircle, return null
			if(ifOverlapNode)
			{
				console.log("after shifting no overlapped LayerRectangles but overlaps with NodeCircle");
				return null;
			}
			//there is no overlapped NodeCircle, return shifted center position
			else
			{
				console.log("after shifting no overlapped LayerRectangles or NodeCircle");
				return new draw2d.geo.Point(layer.centerX, layer.centerY);
			}
		}
	},

	/**
     * @method
     * @param {myDraw2d.shapeDesc.LayerRectangle} l1, l2
     * @returns {boolean} true if two LayerRectangles overlap
     */
	ifLayersOverlap: function(l1, l2){
		if((Math.abs(l2.centerX - l1.centerX) > (l1.width/2 + l2.width/2 + 1)) ||
			(Math.abs(l2.centerY - l1.centerY) > (l1.height/2 + l2.height/2 + 1)))
		{
			return false;
		}
		else
		{
			return true;
		}
	},

	/**
     * @method
     * @param {myDraw2d.shapeDesc.LayerRectangle} layer
     * @param {myDraw2d.shapeDesc.NodeCircle} node
     * @returns {boolean} true if LayerRectangle overlaps any NodeCircle
     */
	ifLayerOverlapNode: function(layer, node){
		//first, if center is inside LayerRectangle, return true
		if(layer.ifPointInside(node.centerX, node.centerY))
			return true;
		//next, if two centers have distance > width/2 + radius on x-axis,
		//or distance > height/2 + radius on y-axis, return false
		if((Math.abs(layer.centerX - node.centerX) > (layer.width/2 + node.radius + 1))
			|| ((Math.abs(layer.centerY - node.centerY)) > (layer.height/2 + node.radius + 1)))
		{
			return false;
		}
		//next, if center of node is around the four corners, and distance between
		//center and vertex of layer > radius, return false
		var vertexX = null, vertexY = null;
		if(node.centerX > (layer.centerX + layer.width/2))
		{
			if(node.centerY > (layer.centerY + layer.height/2))
			{
				vertexX = layer.centerX + layer.width/2;
				vertexY = layer.centerY + layer.height/2;
			}
			else if(node.centerY < (layer.centerY - layer.height/2))
			{
				vertexX = layer.centerX + layer.width/2;
				vertexY = layer.centerY - layer.height/2;
			}
		}
		else if(node.centerX < (layer.centerX - layer.width/2))
		{
			if(node.centerY > (layer.centerY + layer.height/2))
			{
				vertexX = layer.centerX - layer.width/2;
				vertexY = layer.centerY + layer.height/2;
			}
			else if(node.centerY < (layer.centerY - layer.height/2))
			{
				vertexX = layer.centerX - layer.width/2;
				vertexY = layer.centerY - layer.height/2;
			}
		}
		if(vertexX)
		{
			if(this.getDistance(vertexX, vertexY, node.centerX, node.centerY) > node.radius)
			{
				return false;
			}
		}
		//finally, for the rest of scenarios, return true
		return true;
	},

	/**
     * @method
     * @param {Number} x1, y1 position of first point
     * @param {number} x2, y2 position of second point
     * @returns {Number} the distance between two points
     */
	getDistance: function(x1, y1, x2, y2){
		var tmp1 = (x1 - x2),
			tmp2 = (y1 - y2);
		return Math.sqrt(tmp1*tmp1 + tmp2*tmp2);
	}

});



/**
 * @class myDraw2d.shapeDesc.LayerRectangle
 * This class describes position and size of LayerRectangle.
 * @author  Liyan Xu
 */
myDraw2d.shapeDesc.LayerRectangle = Class.extend({
    
	NAME: "myDraw2d.shapeDesc.LayerRectangle",

	/**
     * @constructor 
     */
	init: function(centerX, centerY, width, height){
		this.centerX = centerX;
		this.centerY = centerY;
		this.width = width;
		this.height = height;
	},

	/**
     * @method
     * @param {Number} x
     * @param {number} y
     * @returns {boolean} true if the point is inside this LayerRectangle
     */
	ifPointInside: function(x, y){
		var halfWidth = this.width / 2,
			halfHeight = this.height / 2;
		if((x >= (this.centerX - halfWidth) && x <= (this.centerX + halfWidth))
			&& (y >= (this.centerY - halfHeight) && y <= (this.centerY + halfHeight)))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

});


/**
 * @class myDraw2d.shapeDesc.NodeCircle
 * This class describes position and size of NodeCircle.
 * @author  Liyan Xu
 */
myDraw2d.shapeDesc.NodeCircle = Class.extend({
    
	NAME: "myDraw2d.shapeDesc.NodeCircle",

	/**
     * @constructor 
     */
	init: function(centerX, centerY, radius){
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = radius;
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