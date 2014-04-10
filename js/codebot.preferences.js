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

var CodebotPreferences = function() {
    var mSelf = 0;
    var mSections = {};
    var mCodebot = null;
    var mData = {};
    
    this.get = function() {
        return mData;
    };
    
    this.set = function(theObj) {
        $.extend(true, mData, theObj);
    };
    
    /**
     * Add a new section to the preferences panel. A section is a link that, when clicked, opens
     * a new panel with more preferences (e.g. UI preferences).
     * 
     * @param {Object} theObj - an object describing the new section. It has the following structure: <code>{id: string, title: string, icon: string, panel: function}</code>. The <code>panel</code> property should be a function able to render a panel.
     */ 
    this.addSection = function(theObj) {
        mSections[theObj.id] = theObj;
    }
    
    var panelEditor = function(theContainer, theContext) {
        var aContent = '';
        
        aContent += '<div class="panel panel-default" style="height: 100%;">';
            aContent += '<div class="panel-heading" style="height: 40px;">'+
                            '<h2 class="panel-title pull-right">Editor <i class="fa fa-code"></i></h2>'+
                            '<a href="#" id="codebotPrefEditorBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                        '</div>';
        aContent += '</div>';
        
        theContainer.append(aContent);
        
        $('#codebotPrefEditorBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    }
    
    this.panelSections = function(theContainer, theContext) {
        var aOptions = '';
        var aContent = '';
        
        aContent += '<div class="panel panel-default" style="height: 100%;">';
        aContent += '<div class="panel-heading" style="height: 40px;">'+
                        '<h2 class="panel-title pull-right">Preferences</h2>'+
                        '<a href="#" id="codebotPrefBackButton" class="pull-left"><i class="fa fa-arrow-circle-o-left fa-2x"></i><a/>'+
                    '</div>';
                    
        aContent += '<ul class="list-group">';
                    
        for(var aId in mSections) {
            aContent += '<li class="list-group-item"><a href="#" id="codebotPrefSection'+ aId +'" data-section="'+ aId +'">'+ mSections[aId].icon +' '+ mSections[aId].title +'</a></li>';
        }
        
        aContent += '</ul>';
        aContent += '</div>';
  
        theContainer.append(aContent);
        
        theContainer.find('li a').each(function(i, e) {
            $(e).click(function() {
                var aId = $(this).data('section');
                theContext.ui.slidePanel.pushState(mSections[aId].panel);
            });
        });
        
        $('#codebotPrefBackButton').click(function() {
            theContext.ui.slidePanel.popState();
        });
    };
    
    this.load = function(theCallback) {
        console.log('CODEBOT [prefs] Loading preferences...');
        
        // TODO: fix this, it breaks IO layer
        mCodebot.io.readFile({path: './data/prefs.default.json'}, function(theData) {
            eval('mSelf.set('+theData+')');
            console.log('CODEBOT [prefs] Preferences loaded!', mSelf.get());
            theCallback();
        });
    };
    
    this.init = function(theCodebot) {
        mSelf = this;
        mCodebot = theCodebot;

        // TODO: move it to a better place?
        mSelf.addSection({id: 'editor', title: 'Editor', icon: '<i class="fa fa-code fa-lg"></i>', panel: panelEditor});
        mSelf.addSection({id: 'shortcuts', title: 'Shortcuts', icon: '<i class="fa fa-keyboard-o fa-lg"></i>', panel: null});
        mSelf.addSection({id: 'appearance', title: 'UI and Appearance', icon: '<i class="fa fa-picture-o fa-lg"></i>', panel: null});
        mSelf.addSection({id: 'extensions', title: 'Extensions', icon: '<i class="fa fa-puzzle-piece fa-lg"></i>', panel: null});
        mSelf.addSection({id: 'devenv', title: 'Development Environments', icon: '<i class="fa fa-flask fa-lg"></i>', panel: null});
        mSelf.addSection({id: 'about', title: 'About and Updates', icon: '<i class="fa fa-question-circle fa-lg"></i>', panel: null});
        mSelf.addSection({id: 'bugs', title: 'Feedback and Bug Report', icon: '<i class="fa fa-bug fa-lg"></i>', panel: null});
    };
};