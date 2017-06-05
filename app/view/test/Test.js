Ext.define('testFunc.view.test.Test', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.test',

    controller: 'test',
    viewModel: 'test',

    bind: {
        title: '{heading}'
    },

    items: [
        {
            xtype: 'button',
            text: 'hello',
            handler: 'onButtonClick'
        }
    ]

});