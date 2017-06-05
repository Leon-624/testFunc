Ext.define('testFunc.view.test.TestViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.test',

    onButtonClick: function(){
        var a = this.getViewModel().getData().design;
        console.log(a);
        a.phantom = true;
        a.save();
    }
});