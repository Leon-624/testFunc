/**
 * @class testFunc.util.agents.DesignExportAgent
 * @author  Liyan Xu
 */
Ext.define('testFunc.util.agent.DesignExportAgent', {

	//all config variable can be accessed by getter and setter, but no direct access
    config: {
        canvas: null   //draw2d.CustomCanvas; set by DesignViewController in setDesignAgent method
    },

    /**
     * @constructor
     */
    constructor: function(config){
        this.initConfig(config);
        return this;
    },

    exportPng: function(){
        //generate base64 png source string
        var b64 = this.getCanvas().exportPngSource();
        //export source twice as sometines the canvas has previous figure (bug?)
        b64 = this.getCanvas().exportPngSource();
        //convert string to blob
        var blob = this._b64toBlob(b64, 'image/png');
        //generate blob url
        var url = URL.createObjectURL(blob);
        //open a new window/tab with url
        window.open(url);
    },

    _b64toBlob: function(b64Data, contentType, sliceSize)
    {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize)
        {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++)
            {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

});