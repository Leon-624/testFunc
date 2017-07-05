# ./app/view

This folder contains the views as well as ViewModels and ViewControllers. This is a MVVM/MVCVM application which uses ViewModels for data binding (i.e. stores) and ViewControllers for controllers, and the following directory structure is followed:

    ./app/view/
        foo/                    	# Some meaningful grouping of one or more views
            Foo.js              	# The view class
            FooViewController.js    # The controller for Foo (a ViewController)
            FooViewModel.js         # The ViewModel for Foo

This structure helps keep these closely related classes together and easily identifiable in
most tabbed IDE's or text editors.


# ./app/model

This folder contains the application's (data) Model classes.


# ./app/model

This folder contains the application's util classes with the following structure:

                -- DesignSaveAgent
     -- agent   -- DesignLoadAgent
     			-- DesignClearAgent
                -- DesignExportAgent

                -- DesignContext
util -- context -- DesignListContext
                -- UserContext

                -- GlobalAgentManager   -> classes in agent
     -- manager -- GlobalContextManager -> Classes in context
                -- GlobalEventManager


# ./lib

This folder contains all libraries used and custom extensions.
