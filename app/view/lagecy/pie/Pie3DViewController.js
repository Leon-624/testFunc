Ext.define('testFunc.view.pie.Pie3DViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.pie3d',

    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('os') + ': ' + record.get('data1') + '%');
    },

    onThicknessChange: function (slider, value) {
        var chart = this.lookupReference('chart'),
            series = chart.getSeries()[0];

        series.setThickness(value);
        chart.redraw();
    },

    setPieStyle: function (style) {
        var chart = this.lookupReference('chart'),
            series = chart.getSeries()[0];

        series.setStyle(style);
        chart.redraw();
    },

    onSliderDragStart: function () {
        var chart = this.lookupReference('chart');
        chart.suspendAnimation();
    },

    onSliderDragEnd: function () {
        var chart = this.lookupReference('chart');
        chart.resumeAnimation();
    }

});