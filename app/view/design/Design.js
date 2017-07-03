Ext.define('testFunc.view.design.Design', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.design',

    controller: 'design',
    viewModel: 'design',

    layout: 'hbox',

    bind: {
        title: '{heading}'
    },

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
                        reference: 'designTitleCmpt',
                        bind: {
                            html: '{design.designTitle}<br>Ver. {design.designVersion} - ' + globalContextManager.getUserContext().getUserName()
                        }
                    },
                    {
                        xtype: 'tbspacer',
                        width: 150
                    },
                    {
                        xtype: 'component',
                        reference: 'designDate',
                        html: "Design Date"
                    },
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        text: 'New Design',
                        reference: 'newDesignButton',
                        handler: 'onNewDesignClick'
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
                        reference: 'routerStyleButton',
                        menu: new Ext.menu.Menu({
                            items: [
                                {xtype: 'menucheckitem', group: 'connStyle', text: 'Spline', value: 'spline', reference: 'splineCheckItem', checked: true},
                                {xtype: 'menucheckitem', group: 'connStyle', text: 'Direct', value: 'direct', reference: 'directCheckItem'},
                                {xtype: 'menucheckitem', group: 'connStyle', text: 'Circuit', value: 'circuit', reference: 'circuitCheckItem'}
                            ],
                            listeners: {
                                click: 'onConnStyleMenuClick'
                            }
                        })
                    },
                    {
                        xtype: 'button',
                        text: 'Actions',
                        reference: 'actionsButton',
                        menu: {
                            xtype: 'menu',
                            plain: true,
                            items: [
                                {text: 'Export to PNG', value: 'png', reference: 'exportPngMenuItem'}
                            ],
                            listeners: {
                                click: 'onActionsMenuClick'
                            }
                        }
                    },
                    {
                        xtype: 'splitbutton',
                        text: 'Save',
                        handler: 'onDesignSave',
                        menu: {
                            xtype: 'menu',
                            plain: true,
                            items: [
                                {text: 'Save As', handler: function(){ Ext.Msg.alert('Save As', "To be Implemented."); }}
                            ]
                        }
                    }
                ]
            }
        ];
    	this.items = [
    		{
    			xtype: 'component',
                padding: '10 10 0 14',
                border: '0 2 0 0',
                style: {
                    backgroundColor: '#b0e0e6',
                    borderColor: '#66ccff',
                    borderStyle: 'solid'
                },
    			height: '100%',
                width: 80,
                scrollable: true,
    			loader:{
    				url : 'html/schematicPalettes.html',
                    autoLoad : true,
                    listeners:{
                        //the handler name is looked up on the scope,
                        //which will also be the this reference when the method is called.
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
    			html: '<div id="gfx_holder" class="ui-droppable" style="width:5000px; height:5000px; background-color:#eff5ff;"></div>'
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
                        padding: '5 5 0 5',
                        scrollable: true,
                        title: 'Messages',
                        html: '<h3>&nbsp&nbsp&nbsp&nbsp&nbspWelcome!</h3>',
                        listeners: {
                            afterrender: 'onMsgPanelAfterRender',
                            msg: 'msgEventHandler'
                        }
                    },
                    {
                        xtype: 'tabpanel',
                        reference: 'configTab',
                        anchor: '100%',
                        padding: '5 5 0 5',
                        title: 'Configuration',
                        titleAlign: 'left',
                        tabBarHeaderPosition: 1,    //make tarBar as part of the header and after the title
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
                                title: 'Local',
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
                    },
                    {
                        xtype: 'panel',
                        reference: 'computationPanel',
                        anchor: '100% 20%',
                        padding: '5 5 0 5',
                        scrollable: true,
                        title: 'Computation',
                        html: '<br>&nbsp&nbsp&nbsp&nbsp&nbspTo be implemented.',
                        listeners: {
                            //afterrender: 'onMsgPanelAfterRender',
                        }
                    }
                ]
            }
    	];

    	this.callParent(arguments);
    },

    listeners: {
    	afterrender: 'onAfterRender',
        resize: 'onResize',
        userContextChange: 'onUserContextChange'
    }

});