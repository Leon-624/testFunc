Ext.define('testFunc.view.designlist.DesignListViewModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.designlist',

    data: {
        title: 'Designs'
    },

    stores: {
    	designlist: {
    		model: 'testFunc.model.DesignList',
    		storeId: 'designlist',
			autoLoad: false,

			sorters: [
                {
                    property: 'designTimestamp',
                    direction: 'DESC'
                },
                {
                    property: 'designTitle',
                    direction: 'ASC'
                }
     		],

            proxy: {
                type: 'ajax',
                api: {
                    create: 'hehe/create',
                    read: 'http://localhost:8080/testFuncService/rest/designs/designlist/retrieve/',
                    update: 'hehe/update',
                    destroy: 'hehe/destroy'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    rootProperty: 'designList'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            }
    	}
    }

});
