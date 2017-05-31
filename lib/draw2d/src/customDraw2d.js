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
     * @param {String} id
     */
	init: function(id){
		this._super(id);

		this.util = new myDraw2d.Util();

		//element attributes
		this.layerRecs = [];				//array of LayerRectangles
		this.nodeCirs = [];					//array of NodeCircles
		this.conns = [];					//array of Connections
		this.selectedFigure = null;			//current selected figure; updated in 'select' event
		
		//connection attributes
		this.defaultWeight = 1;				//default weight for connection
		this.defaultRouter = 'spline';		//default router for connection
		this.defaultLabelOn = true;			//default show/hide label for connection
		this.customConnCreatePolicy = null;	//initialize in initPolicies()

		//outside component attributes
		this.msgPanel = null;				//initialize by calling setMsgPanel from outside
		this.configPanel = null;			//initialize by calling setConfigPanel from outside
		
		this.initPolicies();
		this.initEventHandlers();
	},

	/**
     * @method
     * need to be called by outside to enable communications with outside
     * @param {Ext.Component} obj
     */
	setMsgPanel: function(obj){
		this.msgPanel = obj;
	},

	/**
     * @method
     * need to be called by outside to enable communications with outside
     * @param {Ext.Component} obj
     */
	setConfigPanel: function(obj){
		this.configPanel = obj;
	},

	/**
     * @method
     */
	initPolicies: function(){
		this.installEditPolicy(new draw2d.policy.canvas.ExtendedKeyboardPolicy());
    	this.installEditPolicy(new draw2d.policy.canvas.CustomFadeoutDecorationPolicy());
    	//set customConnCreatePolicy
    	this.customConnCreatePolicy = new draw2d.policy.connection.CustomConnectionCreatePolicy
    				(this.defaultWeight, this.defaultRouter, this.defaultLabelOn, $.proxy(this.sendMsgToMsgPanel, this));
        this.installEditPolicy(this.customConnCreatePolicy);
	},

	/**
     * @method
     * set up events to enable communications with outside
     * need to have setConfigPanel() called from outside before any event happens
     */
	initEventHandlers: function(){
		//event 'fromConfigPanel' is used for receiving and handling events from outside config panel
		this.on("fromConfigPanel", $.proxy(this._fromConfigPanelEventHandler, this));
		//event 'select' is used to notify outside config panel with according select info
		this.on("select", $.proxy(this._selectEventHandler, this));
	},

	/**
     * @method
     * only called when registering canvas 'select' event
     */
	_selectEventHandler: function(emitter, event){
		if(this.configPanel)
		{
			if(event.figure!==null && event.figure.name === 'Connection')
			{
				//update selectedFigure
				this.selectedFigure = event.figure;
				this.selectedFigure.makeHighlight();
				this.configPanel.fireEvent("canvasSelect", {
					type: 'selectConnection',
					weight: this.selectedFigure.getWeight(),
					labelOn: this.selectedFigure.labelOn
				});
     		}
     		else
     		{
     			if(this.selectedFigure)
     			{
     				//update selectedFigure
     				this.selectedFigure.cancelHighlight();
     				this.selectedFigure = null;
     				this.configPanel.fireEvent("canvasSelect", {
     					type: 'unselect'
     				});
     			}
     		}
		}
		else
		{
			console.log("config panel not set up");
		}
	},

	/**
     * @method
     * only called when registering canvas 'fromConfigPanel' event
     */
	_fromConfigPanelEventHandler: function(canvas, eventObj){
		if(eventObj.type === 'setConn')
		{
			if(eventObj.weight != this.selectedFigure.getWeight())
			{
				this.selectedFigure.setWeight(eventObj.weight);
				this.sendMsgToMsgPanel("Change connection weight to: " + eventObj.weight);
			}
			if(eventObj.labelOn != this.selectedFigure.isLabelOn())
			{
				this.selectedFigure.setLabelOn(eventObj.labelOn);
				if(eventObj.labelOn)
					this.sendMsgToMsgPanel("Change to show connection label.");
				else
					this.sendMsgToMsgPanel("Change to hide connection label.");
			}
		}
		else
		{
			console.log("fromConfigPanelEventHandler fired; unknown event type");
		}
	},

	/**
     * @method
     * need to have setMsgPanel() called from outside before sending any msg
     * @param {String} msg
     */
	sendMsgToMsgPanel: function(msg){
		if(this.msgPanel)
		{
			this.msgPanel.fireEvent('canvasMsg', {
				type: 'canvasMsg',
				msg: msg
			});
		}
		else
		{
			console.log("sendMsgToMsgPanel fired; msg panel not set up");
		}
	},

	/**
     * @override
     * override onDragEnter for changing size of cloned element
     * onDragEnter has one more parameter 'helper' because I modified the original draw2d.js.
     */
	onDragEnter: function(draggedDomNode, draggedDomNodeHelper){
		var shape = $(draggedDomNode).data('shape'),
			imgDom = $(draggedDomNodeHelper).find("img");
		if(shape === 'layerRec')
		{
			//store original dom image size
			if(!this.util.DEFAULT_WIDTH_DOMIMAGE_LAYERREC)
			this.util.DEFAULT_WIDTH_DOMIMAGE_LAYERREC = $(imgDom).width();
			this.util.DEFAULT_HEIGHT_DOMIMAGE_LAYERREC = $(imgDom).height();
			//apply zoom factor
			$(imgDom).css("width", this.util.DEFAULT_WIDTH_LAYERREC * (1/this.getZoom()));
			$(imgDom).css("height", this.util.DEFAULT_HEIGHT_LAYERREC * (1/this.getZoom()));
		}
		else if(shape === 'nodeCir')
		{
			//store original dom image size
			if(!this.util.DEFAULT_DIAMETER_DOMIMAGE_NODECIR)
			{
				this.util.DEFAULT_DIAMETER_DOMIMAGE_NODECIR = $(imgDom).width();
			}
			//apply zoom factor
			$(imgDom).css("width", this.util.DEFAULT_RADIUS_NODECIR * 2 * (1/this.getZoom()));
			$(imgDom).css("height", this.util.DEFAULT_RADIUS_NODECIR * 2 * (1/this.getZoom()));
		}
		else
		{
			console.log("Shape is not correct.");
		}
	},

	/**
     * @override
     * override onDragLeave for changing size of cloned element
     * onDragLeave has one more parameter 'helper' as I modified the original draw2d.js
     */
	onDragLeave: function(draggedDomNode, draggedDomNodeHelper){
		var imgDom = $(draggedDomNodeHelper).find("img");
		

		var shape = $(draggedDomNode).data('shape'),
			imgDom = $(draggedDomNodeHelper).find("img");
		if(shape === 'layerRec')
		{
			$(imgDom).css("width", this.util.DEFAULT_WIDTH_DOMIMAGE_LAYERREC);
			$(imgDom).css("height", this.util.DEFAULT_HEIGHT_DOMIMAGE_LAYERREC);
		}
		else if(shape === 'nodeCir')
		{
			$(imgDom).css("width", this.util.DEFAULT_DIAMETER_DOMIMAGE_NODECIR);
			$(imgDom).css("height", this.util.DEFAULT_DIAMETER_DOMIMAGE_NODECIR);
		}
		else
		{
			console.log("Shape is not correct.");
		}
	},

	/**
     * @override
     * override onDrop for dropping elements from outside div
     * onDrop has two more parameters uiX, uiY as I modified the original draw2d.js 
     * @param {Number} cursorX, cursorY position of cursor
     * @param {Number} uiX, uiY position of ui element
     */
	onDrop: function(droppedDomNode, cursorX, cursorY, uiX, uiY){
		var shape = $(droppedDomNode).data('shape');
		if(shape === 'layerRec')
		{
			var layerDesc = new myDraw2d.shapeDesc.LayerRectangle(
				uiX + this.util.DEFAULT_WIDTH_LAYERREC/2,
				uiY + this.util.DEFAULT_HEIGHT_LAYERREC/2,
				this.util.DEFAULT_WIDTH_LAYERREC,
				this.util.DEFAULT_HEIGHT_LAYERREC);
			//calculate center position. see decideLayerCenterPos()
			var centerPos = this.util.decideLayerCenterPos(layerDesc, this);
			//if not overlaps with other LayerRectangles or NodeCircles, or can avoid by shifting, create layer
			if(centerPos)
			{
				var imgObj = new draw2d.shape.basic.LayerRectangle(this.util);
				var cmd = new draw2d.command.CommandAdd(this, imgObj,
					centerPos.getX()-imgObj.getWidth()/2, centerPos.getY()-imgObj.getHeight()/2);
				this.getCommandStack().execute(cmd);
				imgObj.toBack();
				//add this layer to layerRecs array
				this.layerRecs.push(imgObj);
			}
			//if cannot avoid overlap with other LayerRectangles or NodeCircles, no action
			else
			{
				console.log("Cannot add overlapped layer");
			}
		}
		else if(shape === 'nodeCir')
		{
			var imgObj = new draw2d.shape.basic.NodeCircle(this.util);
			var cmd = new draw2d.command.CommandAdd(this, imgObj, uiX, uiY);
			this.getCommandStack().execute(cmd);
			this.sendMsgToMsgPanel("Added node successfully.");
			//call _adjustPosition() which updates parent-child relationship and set up position
			imgObj._adjustPosition(true);
			//add this node to nodeCirs array
			this.nodeCirs.push(imgObj);
		}
		else
		{
			console.log("Shape is not correct.");
		}
	},

	/**
     * @method
     * change default router and update every connection
     * @param {String} router 'direct', 'spline', 'circuit'
     */
	updateConnectionRouter: function(router){
		//if same router, no action
		if(router === this.defaultRouter)
		{
			return;
		}
		//update customConnCreatePolicy
		this.uninstallEditPolicy(this.customConnCreatePolicy);
		this.defaultRouter = router;
		this.customConnCreatePolicy = new draw2d.policy.connection.CustomConnectionCreatePolicy
    				(this.defaultWeight, this.defaultRouter, this.defaultLabelOn, $.proxy(this.sendMsgToMsgPanel, this));
		this.installEditPolicy(this.customConnCreatePolicy);
		//update every connection
		var routerObj = null;
		if(router === 'spline')
			routerObj = new draw2d.layout.connection.SplineConnectionRouter();
		else if(router === 'direct')
			routerObj = new draw2d.layout.connection.DirectRouter();
		else if(router === 'circuit')
			routerObj = new draw2d.layout.connection.CircuitConnectionRouter();
		else
			routerObj = new draw2d.layout.connection.SplineConnectionRouter();
		this.getLines().each(function(index, value){
			value.setRouter(routerObj);
		});
		this.sendMsgToMsgPanel("Change connection style to : " + router);
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
     * @param {Number} defaultWeight
     * @param {String} defaultRouter 'direct', 'spline', 'circuit'
     * @param {boolean} defaultLabelOn true to show label by default
     * @param {Method} callback called in createConnection
     */
	init: function(defaultWeight, defaultRouter, defaultLabelOn, callback){
		this._super([
			new draw2d.policy.connection.DragConnectionCreatePolicy({
    			createConnection: function(){
    				if(callback)
    				{
    					callback("Create connection successfully.");
    				}
    				return new draw2d.CustomConnection(defaultWeight, defaultRouter, defaultLabelOn);
    			}
    		})
		]);
	}
});



/**
 * @class draw2d.decoration.connection.CustomArrowDecorator
 * @author  Liyan Xu
 * @extends draw2d.decoration.connection.ArrowDecorator
 */
draw2d.decoration.connection.CustomArrowDecorator = draw2d.decoration.connection.ArrowDecorator.extend({

	NAME: "draw2d.decoration.connection.CustomArrowDecorator",

	/**
     * @constructor
     * @param OPTIONAL {Number} width, height
     */
    init: function(width, height){
    	if(!width)
    	{
    		width = 8;
    		height = 10;
    	}
    	else if(!height)
    		height = 8;
		this._super(width, height);
		this.defaultColor = this.color;
		this.defaultBkColor = '#129ce4';
		this.setBackgroundColor(this.defaultBkColor);
     }
});


/**
 * @class draw2d.decoration.connection.CustomCircleDecorator
 * @author  Liyan Xu
 * @extends draw2d.decoration.connection.CircleDecorator
 */
draw2d.decoration.connection.CustomCircleDecorator = draw2d.decoration.connection.CircleDecorator.extend({

	NAME: "draw2d.decoration.connection.CustomCircleDecorator",

	/**
     * @constructor
     * @param OPTIONAL {Number} width
     */
    init: function(width){
    	if(!width)
    		width = 8;
		this._super(width);
		this.defaultColor = this.color;
		this.defaultBkColor = '#129ce4';
		this.setBackgroundColor(this.defaultBkColor);
     }
});


/**
 * @class draw2d.CustomConnection
 * @author  Liyan Xu
 * @extends draw2d.Connection
 */
draw2d.CustomConnection = draw2d.Connection.extend({

	NAME: "draw2d.CustomConnection",

	/**
     * @constructor
     * @param {Number} defaultWeight
     * @param {String} defaultRouter 'direct', 'spline', 'circuit'
     * @param {boolean} LabelOn true to show label
     */
	init: function(defaultWeight, defaultRouter, labelOn){
		var router = null;
		if(defaultRouter === 'spline')
			router = new draw2d.layout.connection.SplineConnectionRouter();
		else if(defaultRouter === 'direct')
			router = new draw2d.layout.connection.DirectRouter();
		else if(defaultRouter === 'circuit')
			router = new draw2d.layout.connection.CircuitConnectionRouter();
		else
			router = new draw2d.layout.connection.SplineConnectionRouter();
		this._super({
			sourceDecorator: new draw2d.decoration.connection.CustomCircleDecorator(),
			targetDecorator: new draw2d.decoration.connection.CustomArrowDecorator(),
    		//outlineStroke: 1,
    		//outlineColor: '#303030',
    		//color: '91B93E',
    		router: router
		});

		this.name = 'Connection';

		//weight attributes
		this.defaultWeight = defaultWeight;
		this.weight = defaultWeight;	//weight can be set different from defaultWeight by setWeight()
		this.setStrokeFromWeight();

		//color attributes
		this.defaultColor = this.getColor();
		this.highlightColor = '#ff9900';

		//label attributes
		this.labelOn = false;
		this.label = null;	//update in setLabelOn()
		this.setLabelOn(labelOn);
	},

	/**
     * @method
     * getter for this.weight
     */
	getWeight: function(){
		return this.weight;
	},

	/**
     * @method
     * setter for this.weight; change stroke accordingly; change label if label is on
     */
	setWeight: function(weight){
		this.weight = weight;
		//change stroke
		this.setStrokeFromWeight();
		//change label if on
		if(this.labelOn)
		{
			this.remove(this.label);
			this.label = this.createLabelFromWeight();
			this.add(this.label, new draw2d.layout.locator.ManhattanMidpointLocator())
		}
	},

	/**
     * @method
     * getter for this.defaultWeight
     */
	getDefaultWeight: function(){
		return this.defaultWeight;
	},

	/**
     * @method
     * setter for this.defaultWeight; change stroke accordingly
     */
	setDefaultWeight: function(defaultWeight){
		this.defaultWeight = defaultWeight;
		//change stroke
		this.setStrokeFromWeight();
	},

	/**
     * @method
     * getter for this.labelOn
     */
	isLabelOn: function(){
		return this.labelOn;
	},

	/**
     * @method
     * setter for this.labelOn; create or destroy label accordingly
     */
	setLabelOn: function(labelOn){
		if(this.labelOn != labelOn)
		{
			this.labelOn = labelOn;
			//label set to true, create and show label
			if(this.labelOn)
			{
				this.label = this.createLabelFromWeight();
				this.add(this.label, new draw2d.layout.locator.ManhattanMidpointLocator());
			}
			//label set to false, remove and destroy label
			else
			{
				this.remove(this.label);
				this.label = null;
			}
		}
	},

	/**
     * @method
     * set to blink hightlight color
     */
	makeHighlight: function(){
		var me = this;
		me.setColor(me.highlightColor);
		this.interval1 = setInterval(function(){
			me.setColor(me.highlightColor);
		}, 1000);
		setTimeout(function(){
			me.setColor(me.defaultColor);
			me.interval2 = setInterval(function(){
				me.setColor(me.defaultColor);
			}, 1000);
		}, 500);
	},

	/**
     * @method
     * set to default color
     */
	cancelHighlight: function(){
		clearInterval(this.interval1);
		clearInterval(this.interval2);
		this.setColor(this.defaultColor);
	},

	/**
     * @method
     * set stroke according to weight and defaultWeight; scale logistic function
     * y = 6 / (1 + e^(4*(-x+Default)/Default)) + 1, then y = 4 +/- |y - 4|^(8/9) for smoother progression
     */
	setStrokeFromWeight: function(){
		var weightAbs = Math.abs(this.weight);
			exp = -4 * weightAbs / this.defaultWeight + 4,
			stroke = 6 / (1 + Math.exp(exp)) + 1;
		if(stroke > 4)
		{
			stroke = 4 + Math.pow((stroke - 4), 1/2);
		}
		else
		{
			stroke = 4 - Math.pow((4 - stroke), 1/2);
		}
		this.setStroke(stroke);
	},

	/**
     * @method
     * create label according to weight
     */
	createLabelFromWeight: function(){
		return new draw2d.shape.basic.Label({
			text: this.weight,
			fontSize: '10',
			stroke: 0,
			alpha: 1,
			radius: 5,
			selectable: false,
			resizeable: false,
			bgColor: '#e7ffff'
		});
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
			width: util.DEFAULT_WIDTH_LAYERREC,
			height: util.DEFAULT_HEIGHT_LAYERREC,
			bgColor: '#FFFFC7',
			radius: 10,
			glow: true,
			resizeable: false
		});
		this.name = 'LayerRectangle';
		this.childNodes = [];		//array of NodeCircles inside this layer. maintain order as visible display
		this.prePosition = null;	//update when onDragStart
		this.preDragPosition = null;//only used in onDrag for layout purpose; update when onDragStart and onDrag
		this.initPolicies();
	},

	/**
     * @method
     */
	initPolicies: function(){
		this.installEditPolicy(new draw2d.policy.figure.SelectionFeedbackPolicy({
			//shift all child nodes when dragging layer and update preDragPosition
			onDrag: function(canvas, figure){
				var currPos = figure.getPosition(),
				offsetX = currPos.getX() - figure.preDragPosition.getX(),
				offsetY = currPos.getY() - figure.preDragPosition.getY();
				for(var i = 0; i < figure.childNodes.length; ++i)
				{
					var currNode = figure.childNodes[i];
					cmd = new draw2d.command.CommandMove(currNode);
					cmd.setPosition(currNode.getX() + offsetX, currNode.getY() + offsetY);
					canvas.getCommandStack().execute(cmd);
				}
				//update preDragPosition
				figure.preDragPosition = currPos;
			},
			//bring layer and child nodes to front
			//isPrimarySelection here is layerRectangle
			/*onSelect: function(figure, isPrimarySelection){
				isPrimarySelection.toFront();
				for(var i = 0; i < isPrimarySelection.childNodes.length; ++i)
				{
					isPrimarySelection.childNodes[i].toFront();
				}
			}*/
		}));
	},

	/**
     * @override
     * override onDragStart to update prePosition and preDragPosition
     */
	onDragStart: function(){
		this._super();
		//update prePosition
		this.prePosition = this.getPosition();
		//update preDragPosition
		this.preDragPosition = this.getPosition();
		//for display purpose, bring all to front; then bring layer to back on drag end
		this.toFront();
		for(var i = 0; i < this.childNodes.length; ++i)
		{
			this.childNodes[i].toFront();
		}
	},

	/**
     * @override
     * override onDragEnd to move back to prePosition if overlaps with other layers or nodes
     */
	onDragEnd: function(){
		this._super();
		//detect if overlaps with other layers
		var ifOverlap = false,
			canvas = this.getCanvas();
		for(var i = 0; i < canvas.layerRecs.length; ++i)
		{
			var currLayer = canvas.layerRecs[i];
			if(currLayer !== this)
			{
				//overlap
				if(this.ifOverlapWithLayer(currLayer))
				{
					ifOverlap = true;
					break;
				}
			}
		}
		//detect if overlaps with other nodes
		if(!ifOverlap)
		{
			var layerDesc = new myDraw2d.shapeDesc.LayerRectangle(
										this.getX() + this.getWidth()/2,
										this.getY() + this.getHeight()/2,
										this.getWidth(),
										this.getHeight());
			for(var i = 0; i < canvas.nodeCirs.length; ++i)
			{
				var currNode = canvas.nodeCirs[i];
				if(!currNode.parentLayer)
				{
					var currNodeDesc = new myDraw2d.shapeDesc.NodeCircle(
											currNode.getX() + currNode.getDiameter()/2,
											currNode.getY() + currNode.getDiameter()/2,
											currNode.getDiameter()/2);
					if(canvas.util.ifLayerOverlapNode(layerDesc, currNodeDesc))
					{
						ifOverlap = true;
						break;
					}
				}
			}
		}
		//if overlaps, shift layer and child nodes back to prePosition
		if(ifOverlap)
		{
			var currPos = this.getPosition(),
			offsetX = currPos.getX() - this.prePosition.getX(),
			offsetY = currPos.getY() - this.prePosition.getY();
			//move layer
			cmd = new draw2d.command.CommandMove(this);
			cmd.setPosition(this.prePosition);
			canvas.getCommandStack().execute(cmd);
			//move nodes
			for(var i = 0; i < this.childNodes.length; ++i)
			{
				var currNode = this.childNodes[i];
				cmd = new draw2d.command.CommandMove(currNode);
				cmd.setPosition(currNode.getX() - offsetX, currNode.getY() - offsetY);
				canvas.getCommandStack().execute(cmd);
			}
		}
		//for display purpose, bring layer to back
		this.toBack();
	},

	/**
     * @method
     * @param {draw2d.shape.basic.LayerRectangle} layer
     * @returns {boolean} true if overlaps with given layer
     */
	ifOverlapWithLayer: function(layer){
		var l1 = {
			centerX: this.x + this.width/2,
			centerY: this.y + this.height/2,
			width: this.width,
			height: this.height
		};
		var l2 = {
			centerX: layer.x + layer.width/2,
			centerY: layer.y + layer.height/2,
			width: layer.width,
			height: layer.height
		};
		if((Math.abs(l2.centerX - l1.centerX) > (l1.width/2 + l2.width/2 + 2)) ||
			(Math.abs(l2.centerY - l1.centerY) > (l1.height/2 + l2.height/2 + 2)))
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
     * @returns {draw2d.geo.Point} the center point of LayerRectangle
     */
	getCenterPos: function(){
		return new draw2d.geo.Point(this.x + this.width/2, this.y + this.height/2);
	},

	/**
     * @method
     * @param {Number} x
     * @param {Number} y
     * @returns {boolean} true if the point is inside this LayerRectangle
     */
	ifPointInside: function(x, y){
		if((x >= this.x && x <= (this.x + this.width))
			&& (y >= this.y && y <= (this.y + this.height)))
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
			diameter: util.DEFAULT_RADIUS_NODECIR * 2,
			stroke: 1,
			color: '#000000',
			bgColor: '#00A4D1',
			glow: true,
			resizeable: false
		});
		this.name = 'NodeCircle'; 
		this.parentLayer = null;	//parent LayerRectangle; update in _adjustPosition() which is called when onDrop or onDragEnd
		this.preParentLayer = null;	//previous parent LayerRectangle; update to parentLayer when onDragStart
		this.initPort();
		this.initPolicies();
	},

	/**
     * @method
     */
	initPort: function(){
		this.createPort('hybrid', new draw2d.layout.locator.LeftLocator());
		this.createPort('hybrid', new draw2d.layout.locator.RightLocator());
	},

	/**
     * @method
     */
	initPolicies: function(){
		this.installEditPolicy(new draw2d.policy.figure.SelectionFeedbackPolicy({
		}));
	},

	/**
     * @override
     * override onDragStart to bring the node to the front; update preParentLayer
     */
	onDragStart: function(){
		this._super();
		this.preParentLayer = this.parentLayer;
	},

	/**
     * @override
     * override onDragEnd to call _adjustPosition() which updates parent-child relationship and set up position
     */
	onDragEnd: function(){
		this._super();
		this._adjustPosition(true);
	},

	/**
     * @method
     * @returns {draw2d.geo.Point} the center point of NodeCircle
     */
	getCenterPos: function(){
		return new draw2d.geo.Point(this.x + this.width, this.y + this.width);
	},

	/**
     * @method
     * update parent-child relationship and set up position; called when onDrop or onDragEnd
     * @param {boolean} animated true to animate the process
     */
	_adjustPosition: function(animated){
		var canvas = this.getCanvas();
		//update parentLayer
		this.parentLayer = this._decideParentLayer();

		//special case: preParentLayer and parentLayer is the same layer
		//no need to adjust layer height; only shift nodes between drag drop position
		if(this.preParentLayer === this.parentLayer && this.parentLayer)
		{
			var preIndex = this.parentLayer.childNodes.indexOf(this),
				afterIndex = this._decideIndexInParentLayer();
			//if this case, only need to move this node back to original position
			if(afterIndex == preIndex || afterIndex == (preIndex + 1))
			{
				var previousNodePosY = null;
				//if first node, set previousNodePosY to the y pos of parentLayer
				if(preIndex == 0)
				{
					previousNodePosY = this.parentLayer.getY();
				}
				//if not first node, take the y pos of the bottom of previous node
				else
				{
					var preNode = this.parentLayer.childNodes[preIndex - 1];
					previousNodePosY = preNode.getY() + preNode.getDiameter();
				}
				if(animated)
				{
					var myTweenable = new Tweenable();
					var me = this;
            		myTweenable.tween({
						from:     { 'x': me.getX(),
									'y': me.getY()},
                		to:       { 'x': this.parentLayer.getX() + this.parentLayer.getWidth()/2 - me.getDiameter()/2,
                					'y': previousNodePosY + canvas.util.DEFAULT_INTERVAL_HEIGHT},
                		duration: 200,
                		easing: "easeOutSine",
                		step: function(params) {
                   			cmd = new draw2d.command.CommandMove(me);
							cmd.setPosition(params.x, params.y);
							canvas.getCommandStack().execute(cmd);
                		},
                		finish: function(state) {
                			//no action
                		}
            		});
				}
				else
				{
					cmd = new draw2d.command.CommandMove(this);
					cmd.setPosition(this.parentLayer.getX() + this.parentLayer.getWidth()/2 - this.getDiameter()/2,
									previousNodePosY + canvas.util.DEFAULT_INTERVAL_HEIGHT);
					canvas.getCommandStack().execute(cmd);
				}
			}
			//otherwise, shift nodes in between, then move this node
			else
			{
				var offset = canvas.util.DEFAULT_INTERVAL_HEIGHT + this.getDiameter();
				//shift nodes in between
				if(afterIndex > preIndex)
				{
					for(var i = preIndex + 1; i < afterIndex; ++i)
					{
						var currNode = this.parentLayer.childNodes[i];
						cmd = new draw2d.command.CommandMove(currNode);
						cmd.setPosition(currNode.getX(), currNode.getY() - offset);
						canvas.getCommandStack().execute(cmd);
					}
				}
				else
				{
					for(var i = preIndex - 1; i >= afterIndex; --i)
					{
						var currNode = this.parentLayer.childNodes[i];
						cmd = new draw2d.command.CommandMove(currNode);
						cmd.setPosition(currNode.getX(), currNode.getY() + offset);
						canvas.getCommandStack().execute(cmd);
					}
				}
				//move this node to the according position
				//need setTimeout, otherwise will not work correctly
				var thisNode = this;
				setTimeout(function(){
					var y = null;
					if(afterIndex > preIndex)
					{
						var upNode = thisNode.parentLayer.childNodes[afterIndex - 1];
						y = upNode.getY() + upNode.getDiameter() + canvas.util.DEFAULT_INTERVAL_HEIGHT;
						//add to parentLayer.childNodes with according index
						thisNode.parentLayer.childNodes.splice(preIndex, 1);
						thisNode.parentLayer.childNodes.splice(afterIndex - 1, 0, thisNode);
					}
					else
					{
						var downNode = thisNode.parentLayer.childNodes[afterIndex];
						y = downNode.getY() - thisNode.getDiameter() - canvas.util.DEFAULT_INTERVAL_HEIGHT;
						//add to parentLayer.childNodes with according index
						thisNode.parentLayer.childNodes.splice(preIndex, 1);
						thisNode.parentLayer.childNodes.splice(afterIndex, 0, thisNode);
					}
					if(animated)
					{
						var myTweenable = new Tweenable();
            			myTweenable.tween({
							from:     { 'x': thisNode.getX(),
										'y': thisNode.getY()},
                			to:       { 'x': thisNode.parentLayer.getX() + thisNode.parentLayer.getWidth()/2 - thisNode.getDiameter()/2,
                						'y': y},
                			duration: 200,
                			easing: "easeOutSine",
                			step: function(params) {
                				cmd = new draw2d.command.CommandMove(thisNode);
								cmd.setPosition(params.x, params.y);
								canvas.getCommandStack().execute(cmd);
                			},
                			finish: function(state) {
                				//no action
                			}
            			});
					}
					else
					{
						cmd = new draw2d.command.CommandMove(thisNode);
						cmd.setPosition(thisNode.parentLayer.getX() + thisNode.parentLayer.getWidth()/2 - thisNode.getDiameter()/2,
										y);
						canvas.getCommandStack().execute(cmd);
					}
				}, 20);
			}
			return;
		}

		//preParentLayer is not null, adjust preParentLayer layout and update parent-child relationship
		if(this.preParentLayer)
		{
			var index = this.preParentLayer.childNodes.indexOf(this);
			var offset = canvas.util.DEFAULT_INTERVAL_HEIGHT + this.getDiameter();
			//apply offset for layer height
			if(this.preParentLayer.childNodes.length > 1)
			{
				cmd = new draw2d.command.CommandResize(this.preParentLayer);
				cmd.setDimension(this.preParentLayer.getWidth(), this.preParentLayer.getHeight() - offset);
				canvas.getCommandStack().execute(cmd);
			}
			//apply offset for all nodes that have larger index
			for(var i = index + 1; i < this.preParentLayer.childNodes.length; ++i)
			{
				var currNode = this.preParentLayer.childNodes[i];
				cmd = new draw2d.command.CommandMove(currNode);
				cmd.setPosition(currNode.getX(), currNode.getY() - offset);
				canvas.getCommandStack().execute(cmd);
			}
			//remove this node from preParentLayer.childNodes
			this.preParentLayer.childNodes.splice(index, 1);
		}
		//preParentLayer is null
		else
		{
			//no action
		}
		//parentLayer is not null, adjust parentLayer layout and update parent-child relationship
		if(this.parentLayer)
		{
			var index = this._decideIndexInParentLayer();
			var offset = canvas.util.DEFAULT_INTERVAL_HEIGHT + this.getDiameter();
			//apply offset for layer height
			if(this.parentLayer.childNodes.length > 0)
			{
				cmd = new draw2d.command.CommandResize(this.parentLayer);
				cmd.setDimension(this.parentLayer.getWidth(), this.parentLayer.getHeight() + offset);
				canvas.getCommandStack().execute(cmd);
			}
			//apply offset for all nodes that have larger index
			for(var i = this.parentLayer.childNodes.length - 1; i >= index ; --i)
			{
				var currNode = this.parentLayer.childNodes[i];
				cmd = new draw2d.command.CommandMove(currNode);
				cmd.setPosition(currNode.getX(), currNode.getY() + offset);
				canvas.getCommandStack().execute(cmd);
			}
			//move to the according position
			var previousNodePosY = null;
			//if first node, set previousNodePosY to the y pos of parentLayer
			if(index == 0)
			{
				previousNodePosY = this.parentLayer.getY();
			}
			//if not first node, take the y pos of the bottom of previous node
			else
			{
				var preNode = this.parentLayer.childNodes[index - 1];
				previousNodePosY = preNode.getY() + preNode.getDiameter();
			}
			if(animated)
			{
				var myTweenable = new Tweenable();
				var me = this;
            	myTweenable.tween({
					from:     { 'x': me.getX(),
								'y': me.getY()},
                	to:       { 'x': me.parentLayer.getX() + me.parentLayer.getWidth()/2 - me.getDiameter()/2,
                				'y': previousNodePosY + canvas.util.DEFAULT_INTERVAL_HEIGHT},
                	duration: 200,
                	easing: "easeOutSine",
                	step: function(params) {
                   		cmd = new draw2d.command.CommandMove(me);
						cmd.setPosition(params.x, params.y);
						canvas.getCommandStack().execute(cmd);
                	},
                	finish: function(state) {
                		//no action
                	}
            	});
			}
			else
			{
				cmd = new draw2d.command.CommandMove(this);
				cmd.setPosition(this.parentLayer.getX() + this.parentLayer.getWidth()/2 - this.getDiameter()/2,
								previousNodePosY + canvas.util.DEFAULT_INTERVAL_HEIGHT);
				canvas.getCommandStack().execute(cmd);
			}
			//add to parentLayer.childNodes with according index
			this.parentLayer.childNodes.splice(index, 0, this);
		}
		//parentLayer is null
		else
		{
			//no action
		}
	},

	/**
     * @method
     * a layer is parent if the center position of node is inside this layer
     * call this method to set up parent every time a node is dropped or dragged
     * @returns {draw2d.shape.basic.LayerRectangle} or {null}
     */
	_decideParentLayer: function(){
		var layerRecs = this.getCanvas().layerRecs,
			layerLen = layerRecs.length,
			parentLayer = null;
		for(var i = 0; i < layerLen; ++i)
		{
			var currLayer = layerRecs[i];
			if(currLayer.ifPointInside(this.x + this.getDiameter()/2, this.y + this.getDiameter()/2))
			{
				//layers don't overlap, so at most one parentLayer
				parentLayer = currLayer;
				break;
			}
		}
		return parentLayer;
	},

	/**
     * @method
     * the index is decided by the center position of each NodeCircle in the same layer
     * @returns {Number} the index of this NodeCircle in its parentLayer (starting from 0)
     * @returns {null} if parentLayer is null
     */
	_decideIndexInParentLayer: function(){
		if(!this.parentLayer)
			return null;
		var centerY = this.y + this.getDiameter()/2,
			index = 0,
			childNodes = this.parentLayer.childNodes;
		for(index = 0; index < childNodes.length; ++index)
		{
			var currNode = childNodes[index];
			//it is important that currNode is not this, because a node can be dragged to the same layer
			if(currNode !== this)
			{
				if(centerY < (currNode.getY() + currNode.getDiameter()/2))
				{
					break;
				}
			}
		}
		return index;
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
		this.DEFAULT_WIDTH_LAYERREC = 60;
		this.DEFAULT_INTERVAL_HEIGHT = 25;	//the interval between circles in layer
		this.DEFAULT_RADIUS_NODECIR = 20;
		this.DEFAULT_HEIGHT_LAYERREC =
			2 * this.DEFAULT_RADIUS_NODECIR + 2 * this.DEFAULT_INTERVAL_HEIGHT;
		this.DEFAULT_WIDTH_DOMIMAGE_LAYERREC = null;	//value determined in onDragEnter
		this.DEFAULT_HEIGHT_DOMIMAGE_LAYERREC = null;	//value determined in onDragEnter
		this.DEFAULT_DIAMETER_DOMIMAGE_NODECIR = null;	//value determined in onDragEnter
	},

	/**
     * @method
     * @param {myDraw2d.shapeDesc.LayerRectangle} layer
     * @param {draw2d.CustomCanvas} canvas
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
	decideLayerCenterPos: function(layer, canvas){
		var firstOvlpLayerDesc = null,
			layerRecs = canvas.layerRecs,
			nodeCirs = canvas.nodeCirs,
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
				//if currNode has parentLayer, then no need to examine currNode,
				//because currNode would be inside that parentLayer,
				//if overlaps with this currNode, then it would overlap with its parentLayer first
				if(!currNode.parentLayer)
				{
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
				
			}
			//there exists overlapped NodeCircle, return null
			if(ifOverlapNode)
			{
				console.log("no overlapped LayerRectangle but overlapped NodeCircle");
				canvas.sendMsgToMsgPanel("Failed to add layer: layer cannot overlap with other layers or nodes.");
				return null;
			}
			//there is no overlapped NodeCircle, return original center position
			else
			{
				console.log("no overlapped LayerRectangle or NodeCircle");
				canvas.sendMsgToMsgPanel("Added layer successfully.");
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
				canvas.sendMsgToMsgPanel("Failed to add layer: layer cannot overlap with other layers or nodes.")
				return null;
			}
			var ifOverlapNode = false;
			for(var i = 0; i < nodeLen; ++i)
			{
				var currNode = nodeCirs[i];
				if(!currNode.parentLayer)
				{
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
			}
			//there exists overlapped NodeCircle, return null
			if(ifOverlapNode)
			{
				console.log("after shifting no overlapped LayerRectangles but overlaps with NodeCircle");
				canvas.sendMsgToMsgPanel("Failed to add layer: layer cannot overlap with other layers or nodes.");
				return null;
			}
			//there is no overlapped NodeCircle, return shifted center position
			else
			{
				console.log("after shifting no overlapped LayerRectangles or NodeCircle");
				canvas.sendMsgToMsgPanel("Added layer successfully by applying shifting to avoid overlap.");
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
		if((Math.abs(l2.centerX - l1.centerX) > (l1.width/2 + l2.width/2 + 2)) ||
			(Math.abs(l2.centerY - l1.centerY) > (l1.height/2 + l2.height/2 + 2)))
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
     * @param {Number} x2, y2 position of second point
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
     * @param {Number} y
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