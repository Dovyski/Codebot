/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

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

/**
 * A signal system for Codebot. Use it to monitor anything interesting, e.g. a tab
 * has been closed, a file has been saved, etc.
 */

var CodebotSignals = function() {
    /**
     * TODO: add docs.
     */
    this.ready = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.preferencesUpdated = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.projectOpened = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.beforeFilesPanelRefresh = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.beforeLastSlidePanelClose = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.lastSlidePanelClosed = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.tabClosed = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.tabLostFocus = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.tabFocused = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.filesPanelItemClicked = new CodebotSignal();

    /**
     * TODO: add docs.
     */
    this.filesPanelItemDoubleClicked = new CodebotSignal();
};
