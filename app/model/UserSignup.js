Ext.define('testFunc.model.UserSignup', {
	extend: 'Ext.data.Model',

	fields: ['userId', 'userPwd', 'userName', 'userEmail'],
	idProperty: 'userId',

	proxy: {
        type: 'ajax',
        api: {
        	create: 'http://localhost:8080/testFuncService/rest/auth/signup',
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