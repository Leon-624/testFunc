Ext.define('testFunc.view.pie.Pie3DViewModel', {
    extend: 'Ext.data.Store',

    alias: 'store.pie3D',

    stores: {
        users: {
            /*constructor: function(){
                console.log("Store users Constructed");
                this.callParent(arguments);
            },*/

            model: 'testFunc.model.Pie3D',
            storeId: 'storePie3D',
            autoLoad: true,

            data:[
                {"os": "IOS", "data1": 30},
                {"os": "Android", "data1": 70}
            ]

            /*listeners: {
                load: function(){console.log("Store users is loading data");}
            }*/
        }
    }

});