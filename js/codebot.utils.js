/*
	The MIT License (MIT)

	Copyright (c) 2013 Fernando Bevilacqua

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var CODEBOT = CODEBOT || {};

CODEBOT.utils = new function() {

    /**
     * Returns the "directory part" of a string representing a path. E.g.: <code>/my/path/file</code> returns </code>/my/path/</code>
     *
     * @param {string} thePath - path to be analyzed
     * @param {int} theHowManyCuts - how many directories the method should remove from the path. E.g. if <code>theHowManyCuts = 1</code> (default), the path <code>/my/path/file</code> results in </code>/my/path/</code>. If <code>theHowManyCuts = 2</code>, the path <code>/my/path/file</code> results in </code>/my/</code>.
     * @returns {string} the path with some directories removed.
     */
    this.dirName = function(thePath, theHowManyCuts) {
        // From: http://stackoverflow.com/a/1051303/29827
        var aParts = thePath.split(/(\\|\/|\:)/);
        var i = 0;

        theHowManyCuts = theHowManyCuts || 1;

        while(i++ < theHowManyCuts) {
            aParts.pop();
        }

        return aParts.join('');
    };

    /**
     * Returns the extension of a file name.
     *
     * @param {string} theFileName - name of the file
     * @returns {string} the file extension. E.g. if <code>theFileName</code> is <code>Test.as</code>, the method returns <code>as</code>.
     */
    this.getExtension = function(theFileName) {
        return theFileName.substring(theFileName.lastIndexOf('.') + 1);
    };


    this.invoke = function(theObj, theMethod, theParam) {
        return theObj[theMethod](theParam);
	};

    this.sanitizeId = function(theString) {
        return theString.replace(/\./g, '-');
    };

    this.getURLParamByName = function(theName) {
        theName = theName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var aRegex = new RegExp("[\\?&]" + theName + "=([^&#]*)"),
            aResults = aRegex.exec(location.search);
        return aResults === null ? "" : decodeURIComponent(aResults[1].replace(/\+/g, " "));
    };

    this.objectToUrlParams = function(theObject) {
        var aRet = [];

        for(var i in theObject) {
            aRet.push(i + '=' + encodeURI(theObject[i]));
        }

        return aRet.join('&');
    };

    this.expandProps = function(theProps, theEqualChar, theQuoteChar, theSeparatorChar) {
    	var aRet = '',
    		aProp;

    	theEqualChar = theEqualChar || '=';
    	theQuoteChar = theQuoteChar || '"';
    	theSeparatorChar = theSeparatorChar || ' ';

    	if(theProps == null) {
    		return '';
    	}

    	for(aProp in theProps) {
    		aRet = aProp + theEqualChar + theQuoteChar + (typeof theProps[aProp] == 'object' ? this.expandProps(theProps[aProp], ':', ' ', ';') : theProps[aProp]) + theQuoteChar + theSeparatorChar;
    	}

        return aRet;
    };

    this.convertPropertyValueToRightType = function(theObject) {
        var aProp,
            aValue,
            aRet = {};

        for(aProp in theObject) {
            aValue = theObject[aProp];

            if(aValue != null && typeof aValue == 'string') {
                if(aValue.match(/-*[0-9]*\.[0-9]*/g) != null) {
                    // Float
                    aValue = parseFloat(aValue);

                } else if(aValue.match(/^[0-9]+$/) != null) {
                    // Integer
                    aValue = parseInt(aValue);

                } else if(aValue == 'true' || aValue == 'false') {
                    // Boolean
                    aValue = Boolean(aValue);
                }
            }

            if(typeof aValue != 'function') {
                aRet[aProp] = aValue;
            }
        }

        return aRet;
    };

    this.redirect = function(theURL) {
        window.location.href = theURL;
    };

    this.covertInputElementsToJSON = function(theElement) {
        var aRet = {},
            aValue;

        theElement.find(':input').each(function(theIndex, theItem) {
            if(theItem.type == 'checkbox') {
                aValue = $(theItem).is(':checked');

            } else {
                aValue = $(theItem).val();

            }
            aRet[theItem.name] = aValue;
        });

        return aRet;
    };
};
