/**
 * @class testFunc.util.context.DesignListContext
 * @author  Liyan Xu
 */
Ext.define('testFunc.util.context.DesignListContext', {

	//all config variable can be accessed by getter and setter, but no direct access
	config: {
		designListStore: null	//store of testFunc.model.DesignList; set by DesignListViewController in setDesignListContext method
	},

	/**
     * @constructor
     */
	constructor: function(config){
		this.initConfig(config);
		return this;
	},

	/**
     * @method
     * called by DesignSaveAgent upon successful saving
     * add new item into store if record is initial design (version 1)
     * update existing item in store if record is not initial design (version > 1)
     * @param {testFunc.model.DesignDetail} record
     */
	updateRecord: function(record){
		var designListStore = this.getDesignListStore();
		if(designListStore)
		{
			//record is initial design, add new item into designListStore
			if(record.get('designVersion') === 1)
			{
				var newDesignListItem = Ext.create('testFunc.model.DesignList',{  
    				designId: record.get('designId'),
    				designTitle: record.get('designTitle'),
                	designDescription: record.get('designDescription'),
                	designVersion: record.get('designVersion'),
                	designParent: record.get('designParent'),
                	designTimestamp: record.data.designTimestamp,
                	designCreateTimestamp: record.data.designCreateTimestamp,
                	designUserId: record.get('designUserId')
				});
				//phantom doesn't matter here because store are not going to sync
				newDesignListItem.phantom = true;
				designListStore.add(newDesignListItem);
			}
			//record is not initial design, update existing design in designListStore
			else
			{
				var previousDesign = designListStore.findRecord('designTitle',
									record.get('designTitle'));
				previousDesign.set({
					designId: record.get('designId'),
					designDescription: record.get('designDescription'),
					designVersion: record.get('designVersion'),
					designParent: record.get('designParent'),
					//can use record.get('designTimestamp')
					//because no field conversion in DesignDetail model
					designTimestamp: record.get('designTimestamp'),
                	designCreateTimestamp: record.get('designCreateTimestamp'),
                	designUserId: record.get('designUserId')
				});
				//crudState doesn't matter here because store are not going to sync
				previousDesign.crudState = 'U';
			}
			//update listInfo
			if(globalEventManager.isRegistered('listInfoCmpt'))
				globalEventManager.makeEvent('listInfoCmpt', 'updateListInfo', designListStore.getCount());
			else
				console.log('DesignListContext: listInfoCmpt not registered');
		}
		else
		{
			console.log("DesignListContext: designListStore is not set.");
		}
	}
});