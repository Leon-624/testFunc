Ext.define('testFunc.model.DesignList', {
	extend: 'Ext.data.Model',

	fields: [
		'designId',
		'designTitle',
		'designDescription',
		'designVersion',
		'designParent',
		{
			name: 'designTimestamp',
			//convert timestamp to readable date and time
			convert: function(value){
				if(typeof(value) === 'number')
					return globalUtil.convertTsToDate(value, 3);
				else
					return value;
			},
			//define sortType for sorter in store
			sortType: function(value){
				//value4Cmp format: YYMM/DD/00 HH:MM
				var value4Cmp = (value[6] + value[7]);
				value4Cmp += value;
				value4Cmp[8] = '0';
				value4Cmp[9] = '0';
				return value4Cmp;
			}
		},
		{
			name: 'designCreateTimestamp',
			//convert timestamp to readable date and time
			convert: function (value){
				if(typeof(value) === 'number')
					return globalUtil.convertTsToDate(value, 3);
				else
					return value;
			},
			//define sortType for sorter in store
			sortType: function(value){
				//value4Cmp format: YYMM/DD/00 HH:MM
				var value4Cmp = (value[6] + value[7]);
				value4Cmp += value;
				value4Cmp[8] = '0';
				value4Cmp[9] = '0';
				return value4Cmp;
			}
		},
		'designUserId'
	],
	idProperty: 'designId'

});