Ext.define('testFunc.model.UserLogin', {
	extend: 'Ext.data.Model',

	fields: ['userId', 'userPwd'],
	idProperty: 'userId',

	proxy: {
        type: 'ajax',
        api: {
        	create: 'http://localhost:8080/testFuncService/rest/auth/validate',
    		read: 'hehe/read',
    		update: 'hehe/update',
    		destroy: 'hehe/destroy'
        },
        reader: {
        	type: 'json',
			successProperty: 'success'
        },
        writer: {
        	type: 'json',
        	writeAllFields: true
        }
    }

});