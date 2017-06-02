Ext.define('testFunc.view.design.Design', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.design',

    controller: 'design',
    //viewModel: 'design',

    layout: 'hbox',
    //width and height determined by anchor in Application.js

    title: 'Design (try connecting ports of entities by drag-drop or click-click?)',

    initComponent: function(){
        me = this;
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                style: {
                    backgroundColor: '#f2f2f2'
                },
                items: [
                    {
                        xtype: 'component',
                        html: 'Design Title'
                    },
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'slider',
                        width: 150,
                        minValue: 1,
                        maxValue: 50,
                        value: 10,
                        increment: 1,
                        fieldLabel: "Zoom",
                        labelAlign: 'left',
                        labelWidth: 40,
                        listeners: {
                            change: 'onZoomSliderChange'
                        }
                    },
                    {
                        xtype: 'button',
                        text: 'Style',
                        menu: new Ext.menu.Menu({
                            items: [
                                {xtype: 'menucheckitem', group: 'connStyle', text: 'Spline', value: 'spline', checked: true},
                                {xtype: 'menucheckitem', group: 'connStyle', text: 'Direct', value: 'direct'},
                                {xtype: 'menucheckitem', group: 'connStyle', text: 'Circuit', value: 'circuit'}
                            ],
                            listeners: {
                                click: 'onConnStyleMenuClick'
                            }
                        })
                    },
                    {
                        xtype: 'splitbutton',
                        text: 'Save',
                        handler: 'onDesignSave',
                        menu: new Ext.menu.Menu({
                            plain: true,
                            items: [
                                // these will render as dropdown menu items when the arrow is clicked:
                                {text: 'Menu Item 1', handler: function(){ Ext.Msg.alert('alert', "Item 1 was clicked"); }},
                                {text: 'Menu Item 2', handler: function(){ Ext.Msg.alert('alert', "Item 2 was clicked"); }}
                            ]
                        })
                    }
                ]
            }
        ];
    	this.items = [
    		{
    			xtype: 'component',
                padding: '5, 5, 5, 5',
                style: {
                    backgroundColor: '#b0e0e6'
                },
    			height: 170,
                width: 65,
    			loader:{
    				url : 'html/schematicPalettes.html',
                    autoLoad : true,
                    listeners:{
                        scope: me.controller,
                        load: 'onPalettesLoad'
                    }
    			}
    		},
    		{
    			xtype: 'component',
                flex: 1,
                height: '100%',
    			scrollable: true,
    			html: '<div id="gfx_holder" class="ui-droppable" style="width:10000px; height:10000px; background-color:#eff5ff;"></div>'
                    //+ '<div id="zoomSlider" style="height:150px; position:absolute; top:30px; left:30px; z-index:26000"></div>'
    		},
            {
                xtype: 'panel',
                width: 300,
                height: '100%',
                scrollable: true,
                /*style: {
                    backgroundColor: '#b0e0e6'
                },*/
                layout: 'anchor',
                //title: 'Design Panel',
                items: [
                    {
                        xtype: 'panel',
                        reference: 'messagePanel',
                        anchor: '100% 40%',
                        scrollable: true,
                        title: 'Messages',
                        html: '<h3>&nbsp&nbsp&nbsp&nbsp&nbspWelcome!</h3>',
                        listeners: {
                            afterrender: 'onMsgPanelAfterRender',
                            canvasMsg: 'canvasMsgEventHandler'
                        }
                    },
                    {
                        xtype: 'tabpanel',
                        reference: 'configTabs',
                        anchor: '100%',
                        activeTab: 1,
                        plain: false,
                        items: [
                            {
                                xtype: 'form',
                                reference: 'globalConfigPanel',
                                bodyPadding: 10,
                                title: 'Global',
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        reference: 'defaultWeightNumberfield',
                                        fieldLabel: 'Default Weight',
                                        name: 'connDefaultWeight',
                                        allowBlank: false,
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        disabled: false
                                    }
                                ],
                                buttons: [
                                    {
                                        text: 'Save',
                                        formBind: true,
                                        handler: 'onGlobalConfigSave'
                                    }
                                ],
                                listeners: {
                                    afterrender: 'onGlobalConfigAfterRender'
                                }
                            },
                            {
                                xtype: 'form',
                                reference: 'selectedConfigPanel',
                                bodyPadding: 10,
                                title: 'Selected',
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        reference: 'weightNumberfield',
                                        fieldLabel: 'Weight',
                                        name: 'connWeight',
                                        allowBlank: false,
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        disabled: true
                                    },
                                    {
                                        xtype: 'checkbox',
                                        reference: 'labelCheckbox',
                                        fieldLabel: 'Label',
                                        name: 'connLabel',
                                        checked: false,
                                        disabled: true
                                    },
                                    {
                                        //add this hidden field to make save button disabled initially & when no conn selected
                                        xtype: 'textfield',
                                        reference: 'hiddenTextfield',
                                        hidden: true,
                                        name: 'hiddenField',
                                        allowBlank: false,
                                        disabled: false
                                    }
                                ],
                                buttons: [
                                    {
                                        text: 'Save',
                                        reference: 'selectedConfigSaveButton',
                                        //formBind result will override disabled config
                                        //formBind will prevent button disabled initially, because
                                        //disabled fields are always treated as valid.
                                        //to make button disabled initially, add a hidden field for validation
                                        formBind: true,
                                        handler: 'onSelectedConfigSave'
                                    }
                                ],
                                listeners: {
                                    afterrender: 'onSelectedConfigAfterRender',
                                    canvasSelect: 'canvasSelectEventHandler'    //receive events from canvas
                                }
                            }
                        ]
                    }
                ]
            }
    	];

    	this.callParent(arguments);
    },

    listeners: {
    	afterrender: 'onAfterRender',
        resize: 'onResize'
    }

});