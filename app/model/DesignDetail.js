Ext.define('testFunc.model.DesignDetail', {
	extend: 'Ext.data.Model',

	fields: [
		'designId',
		'designTitle',
		'designDescription',
		'designMemento',
		'canvasMemento',
		'designVersion',
		'designParent',
		'designTimestamp',		//do not use convert because it needs to be consistent with service
		'designCreateTimestamp',//do not use convert because it needs to be consistent with service
		'designUserId'
	],
	idProperty: 'designId',

	convertOnSet: true,

	proxy: {
        type: 'ajax',
        api: {
        	create: globalConst.modelUrl.designDetail.create,
    		read: globalConst.modelUrl.designDetail.read,
    		update: 'hehe/update',
    		destroy: 'hehe/destroy'
        },
        reader: {
        	type: 'json',
			successProperty: 'success',
			rootProperty: 'design'
        },
        writer: {
        	type: 'json',
        	writeAllFields: true
        }
    }
});