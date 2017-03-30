/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('testFunc.view.dd.CarTableViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cartable',
      //  view : 'widget.cartable',


    beforeLoad: function(){
        console.log("before load");
    },

    afterLoad: function(){
        //var me = this.getView();
        console.log("after load");
    },

    test: function() {
        console.log("test!!!!!!!!!!!");
    },



    setDD: function(me){
        var overrides = {
            onMouseUp: function(e){
                console.log("Mouse Up");
                //e.stopEvent();
            },
            onMouseDown: function(e){
                console.log("Mouse Down");
            },
            onDrag: function(e){
                console.log("On Drag");
            },
            endDrag: function(e){
                console.log("End Drag");
                //e.stopEvent();
            },

            b4StartDrag: function(){
                // Cache the drag element
                if (!this.el) {
                    this.el = this.getEl();
                }
                this.originalXY = this.el.getXY();
                //console.log("Before Drag Ele: " + this.el);
                //console.log("Before Drag XY: " + this.originalXY);
            },
            //called when dropped in non-dropzone or without matching ddgroup
            onInvalidDrop: function(){
                this.invalidDrop = true;
            },
            //called when drag completes
            endDrag: function(){
                console.log("End Drag");
                if(this.invalidDrop === true)
                {
                    this.el.removeCls('dropOK');
                    var animCfgObj = {
                        easing: 'elasticIn',
                        duration: 1000,
                        scope: this
                        //callback: function(){
                            //this.el.dom.style.position = '';
                        //}
                    };
                    //console.log("After Drag XY: " + this.el.getXY());
                    this.el.setXY(this.originalXY, animCfgObj);
                    console.log("Reset XY: " + this.originalXY);
                    delete this.invalidDrop;
                }
            }
        };

        /*var carGroup1Cmp = me.down('#carGroup1'),
            carGroup1Ele = carGroup1Cmp.getEl().select('img');*/

        //var carGroup1Cmp = me.getEl().select('#divIdCarGroup1');
            //carGroup1Ele = carGroup1Cmp[0].select('img');
        /*console.log(me.getEl().select('img'));
        Ext.each(carGroup1Ele.elements, function(el){
            console.log("yo: " + el);
            var dd = Ext.create('Ext.dd.DD', el, 'carGroup1DD', {isTarget: false});
            Ext.apply(dd, overrides);
        });*/

        var carGroup2Cmp = me.down('#carGroup2'),
            carGroup2Ele = carGroup2Cmp.getEl().select('img');
        //console.log(carGroup2Ele);
        Ext.each(carGroup2Ele.elements, function(el){
            var dd = Ext.create('Ext.dd.DD', el, 'carGroup2DD', {isTarget: true});
            Ext.apply(dd, overrides);
        });

         //var group3 = me.down('#rented'),
        var mainTarget = Ext.create('Ext.dd.DDTarget', 'rented', 'carGroup2DD', {
         ignoreSelf: false
      });
    }

});
