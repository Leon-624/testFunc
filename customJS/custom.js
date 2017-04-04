draw2d.CustomCanvas = draw2d.Canvas.extend({

	init: function(id){
		this._super(id);
	},

	onDrop: function(droppedDomNode, x, y){
		var shape = $(droppedDomNode).data('shape');
		var imgObj = new draw2d.shape.basic.SiteImg(shape);
		var cmd = new draw2d.command.CommandAdd(this, imgObj, x, y);
		this.getCommandStack().execute(cmd);
	}

});




draw2d.shape.basic.SiteImg = draw2d.shape.basic.Image.extend({

	NAME : "draw2d.shape.basic.SiteImg",

	init: function(shape){
		this._super({
			path: 'img/schematic/svg/mkt/' + shape + '.svg',
			width: 70,
			height: 70,
			minWidth: 70,
			minHeight: 70
		});
	}

});