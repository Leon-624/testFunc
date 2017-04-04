Ext.define('testFunc.view.pie.Pie3D', {
    extend: 'Ext.Panel',

    alias: 'widget.pie3d',
    controller: 'pie3d',
    requires: [
        'Ext.chart.PolarChart'
    ],

    layout: 'vbox',
    width: '100%',
    title: 'Chances that I am a good guy?',

    items: [{
        xtype: 'polar',
        reference: 'chart',
        innerPadding: 40,
        width: '100%',
        height: 500,
        store: {
            data:[
                {"os": "Good Guy", "data1": 21},
                {"os": "Bad Guy", "data1": 28},
                {"os": "Who Cares", "data1": 51},
            ]
        },
        //theme: 'Muted',
        interactions: ['itemhighlight', 'rotatePie3d'],
        legend: {
            docked: 'bottom'
        },
        series: [
            {
                type: 'pie3d',
                angleField: 'data1',
                donut: 30,
                distortion: 0.6,
                highlight: {
                    margin: 40
                },
                label: {
                    field: 'os'
                },
                tooltip: {
                    trackMouse: true,
                    renderer: 'onSeriesTooltipRender'
                }
            }
        ]
    }, {
        xtype: 'container',
        width: '100%',
        padding: 10,
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        items: {
            xtype: 'form',
            defaults: {
                labelAlign: 'right',
                labelPad: 15,
                width: 400
            },
            items: [{
                xtype: 'sliderfield',
                fieldLabel: 'Thickness',
                value: 35,
                minValue: 20,
                maxValue: 70,
                listeners: {
                    change: 'onThicknessChange',
                    dragstart: 'onSliderDragStart',
                    dragend: 'onSliderDragEnd'
                }
            }]
        }
    }]
});