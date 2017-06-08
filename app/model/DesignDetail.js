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
		{
			name: 'designTimestamp',
			//convert timestamp to readable date and time
			convert: function (value) {
				if(typeof(value) === 'number')
					return globalUtil.convertTsToDate(value, 3);
				else
					return value;
			}
		},
		{
			name: 'designCreateTimestamp',
			//convert timestamp to readable date and time
			convert: function (value) {
				if(typeof(value) === 'number')
					return globalUtil.convertTsToDate(value, 3);
				else
					return value;
			}
		},
		'designUserId'
	],
	idProperty: 'designId',

	proxy: {
        type: 'ajax',
        api: {
        	create: 'http://localhost:8080/testFuncService/rest/designs/create',
    		read: 'hehe/read',
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