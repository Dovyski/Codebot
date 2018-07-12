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

var CodebotTabs = function() {
    var mSelf           = null;
    var mTabController  = null;
    var mActiveTab      = null;
    var mOpenTabs       = [];
    var mCodebot        = null;
    var mIds            = 0;

    var onTabClose = function(theTab) {
        var aData = theTab.data('tabData').data;
        $('#' + aData.container).remove();
		aData.editor = null;
        mCodebot.signals.tabClosed.dispatch([aData]);

        for(var i = 0; i < mOpenTabs.length; i++) {
            if(mOpenTabs[i].id == aData.id) {
                mOpenTabs.splice(i, 1);
            }
        }

        if(mOpenTabs.length == 0) {
            hideTabsBar();
        }
	};

	var onTabBlur = function(theTab) {
        var aData = theTab.data('tabData').data;
        $('#' + aData.container).hide();

        mCodebot.signals.tabLostFocus.dispatch([aData]);
	};

	var onTabFocus = function(theTab) {
        var aData = theTab.data('tabData').data;
		$('#' + aData.container).show();
        mActiveTab = theTab;

        mCodebot.signals.tabFocused.dispatch([aData]);
	};

    /**
     * Invoked by the tab manager to check if the tab can be closed or not.
     *
     * @return bool <code>true</code> if the tab can be closed, or <code>false</code> otherwise (tab will remain open).
     */
    var tabPreClose = function(theRawTab) {
        // TODO: check if file has changes
        var aTab = theRawTab.data('tabData').data;

        if(aTab.isDirty()) {
            mCodebot.ui.showDialog({
                keyboard: true,
                title: 'Important',
                content: 'This file has changes. Do you want to save them?',
                buttons: {
                    'Yes': {css: 'btn-primary', dismiss: true, callback: function() {
                        CODEBOT.writeTabToDisk(aTab);
                        mTabController.closeTab(theRawTab);
                    }},
                    'No': {css: 'btn-default', dismiss: true, callback: function() {
                        mTabController.closeTab(theRawTab);
                    }},
                    'Cancel': {css: 'btn-default', dismiss: true}
                }
            });

            // Inform the tab to remain active until the user has decided what
            // to do with it (using the dialog above)
            return false;

        } else {
            // No changes, it's clear to go!
            return true;
        }
    };

    var onTabSorted = function(theTab, theNewZIndex) {
        var aTab = theTab.data('tabData');

        if(aTab) {
            aTab.data.index = theNewZIndex;
        }
	};

    var getTabDataById = function(theId) {
        return mTabController.getRawTabById(theId).data('tabData').data;
    };

    var showTabsBar = function() {
        $('#tabs').show();
    };

    var hideTabsBar = function() {
        $('#tabs').hide();
    };

    /**
     * Adds a new tab.
     *
     * @param {object} theConfig - configuration used to create the new tab. Structure:
     * <code>
     * {
     *    favicon: String,      // FontAwesome class, e.g. <code>file-text-o</code>
     *    title: String,        // Tab title.
     *    editor: Object,       // Instance of an editor able to manipulate the content, e.g. CodeMirror.
     *    file: String,         // File name. E.g. <code>codebot.js</code>
     *    path: String,         // File path. E.g. <code>/home/user/project/codebot.js</code>
     *    data: Object,         // (Optional) Any special data you want connected to that tab (read it later at <code>tab.data</code>).
     * }
     * </code>
     * @returns {object} an object describing the newly created tab.
     */
    this.add = function(theConfig) {
        var aJustAddedTab,
            aTab;

        aTab = {
            favicon: 'file-text-o',
            title: 'Unknown',
            editor: null,
            file: 'unknown',
            path: '',
            id: mIds,
            index: 0,
            container: 'tab-content-' + mIds,
            dirty: false, // TODO: make it private

            // TODO: move this to a new class
            setDirty: function(theStatus) {
                this.dirty = theStatus;
                var aColor = this.dirty ? '#ff0000' : 'transparent';
                $('#codebot-tab-' + this.id + ' div.chrome-tab-favicon').html('<i class="fa fa-file-text-o" style="color: '+ aColor +';"></i>');
            },

            isDirty: function() {
                return this.dirty;
            }
        };

        $.extend(aTab, theConfig);
        $('#working-area').append('<div id="'+aTab.container+'" class="tab-content"><span class="tab-loading-info"><i class="fa fa-sun-o fa-spin fa-2x"></i></span></div>');
        showTabsBar();

        mTabController.add({
            favicon: theConfig.favicon || 'file-text-o',
            title: theConfig.title,
            data: aTab
        });

        aJustAddedTab = getTabDataById(mIds);
        mIds++;

        // Add the tab to the list of open tabs
        mOpenTabs.push(aJustAddedTab);

        // Tell everybody that a new tab has been opened.
        mCodebot.signals.tabOpened.dispatch([aJustAddedTab]);

        return aJustAddedTab;
	};

    this.remove = function(theTabId) {
        var aTabRaw = mTabController.getRawTabById(theTabId);

        if(aTabRaw && tabPreClose(aTabRaw)) {
            mTabController.closeTab(aTabRaw);
        }
    };

    this.focusOn = function(theTabId) {
        var aRawTab = mTabController.getRawTabById(theTabId);

        if(!aRawTab) {
            return false;
        }

        mTabController.setCurrent(aRawTab);
        return true;
    }

    /**
     * Find any open tab that is already handling a particular node.
     *
     * @param  {Object} theNode filespanel node.
     * @return {Tab}            existing tab that is handling the node, or <code>null</code> otherwise.
     */
    this.getTabByNode = function(theNode) {
        for(var i = 0; i < mOpenTabs.length; i++) {
            if(mOpenTabs[i].node.path == theNode.data.path) {
                return mOpenTabs[i];
            }
        }
        return null;
    };

    /**
     * Opens any filespanel node in a new tab. The method will use Codebot
     * registered editors to pick the best one able to handle the file editing.
     *
     * @param {Object} theNode - filespanel node.
     */
    this.openNode = function(theNode) {
        var aTab = mCodebot.ui.tabs.getTabByNode(theNode);

        if(aTab != null) {
            // There is a tab already open handling this node, so we
            // just bring it to focus.
            mCodebot.ui.tabs.focusOn(aTab.id);
            return;
        }

        aTab = mCodebot.ui.tabs.add({
            favicon: 'file-text-o', // TODO: dynamic icon?
            title: theNode.data.name,
            file: theNode.data.name,
            path: theNode.data.path,
            node: theNode.data, // TODO: make this the only property here...
            editor: null
        });

        mCodebot.io.readFile(theNode.data, function(theData) {
            aTab.editor = mCodebot.editors.create(aTab, theData, theNode.data);
        });
    };

    this.init = function(theCodebot) {
        mSelf = this;
        mCodebot = theCodebot;

        // get tab context from codebot.ui.tabs.js
		mTabController = window.chromeTabs;

		mTabController.init({
			container: '.chrome-tabs-shell',
			minWidth: 20,
			maxWidth: 100,

			deactivated: onTabBlur,
			activated: onTabFocus,
			closed: onTabClose,
			shouldClose: tabPreClose,
			sorted: onTabSorted,
		});
    };

    // Getters and setters
    /**
     * @return {CodebotTab}  Returns a reference to the currently active (selected) tab.
     */
    this.__defineGetter__("active", function() { return mActiveTab ? mActiveTab.data('tabData').data : null; });
    /**
     * @return {Object}  A list containing all currently open tabs.
     */
    this.__defineGetter__("opened", function() { return mOpenTabs; });
};


/*
	The MIT License (MIT)
	Copyright (c) 2013 Adam Schwartz

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

    NOTE: original code has been modified by Fernando Bevilacqua <dovyski@gmail.com>
*/

(function() {
  var $, chromeTabs, defaultNewTabData, tabTemplate, $shell, opts;
  $ = jQuery;
  if (document.body.style['-webkit-mask-repeat'] !== void 0) {
    $('html').addClass('cssmasks');
  } else {
    $('html').addClass('no-cssmasks');
  }
  tabTemplate = '<div class="chrome-tab" id="{id}">\n    <div class="chrome-tab-favicon"></div>\n    <div class="chrome-tab-title"></div>\n    <div class="chrome-tab-close"></div>\n    <div class="chrome-tab-curves">\n        <div class="chrome-tab-curve-left-shadow2"></div>\n        <div class="chrome-tab-curve-left-shadow1"></div>\n        <div class="chrome-tab-curve-left"></div>\n        <div class="chrome-tab-curve-right-shadow2"></div>\n        <div class="chrome-tab-curve-right-shadow1"></div>\n        <div class="chrome-tab-curve-right"></div>\n    </div>\n</div>';
  defaultNewTabData = {
    title: 'New Tab',
    favicon: '',
    data: {}
  };
  chromeTabs = {
    init: function(options) {
      var render;

	  opts = options;
	  $shell = $(options.container);

      $.extend($shell.data(), options);
      $shell.find('.chrome-tab').each(function() {
        return $(this).data().tabData = {
          data: {}
        };
      });
      render = function() {
        return chromeTabs.render($shell);
      };
      $(window).resize(render);
      return render();
    },
    render: function() {
      chromeTabs.fixTabSizes($shell);
      chromeTabs.fixZIndexes($shell);
      chromeTabs.setupEvents($shell);
      chromeTabs.setupSortable($shell);
      return $shell.trigger('chromeTabRender');
    },
    setupSortable: function() {
      var $tabs;
      $tabs = $shell.find('.chrome-tabs');
      return $tabs.sortable({
        axis: 'x',
        tolerance: 'pointer',
        start: function(e, ui) {
          chromeTabs.fixZIndexes($shell);
          if (!$(ui.item).hasClass('chrome-tab-current')) {
            return $tabs.sortable('option', 'zIndex', $(ui.item).data().zIndex);
          } else {
            return $tabs.sortable('option', 'zIndex', $tabs.length + 40);
          }
        },
        stop: function(e, ui) {
          return chromeTabs.setCurrent($(ui.item));
        }
      });
    },
    fixTabSizes: function() {
      var $tabs, margin, width;
      $tabs = $shell.find('.chrome-tab');
      margin = (parseInt($tabs.first().css('marginLeft'), 10) + parseInt($tabs.first().css('marginRight'), 10)) || 0;
      width = $shell.width() - 50;
      width = (width / $tabs.length) - margin;
      width = Math.max($shell.data().minWidth, Math.min($shell.data().maxWidth, width));
      return $tabs.css({
        width: width
      });
    },
    fixZIndexes: function() {
      var $tabs;
      $tabs = $shell.find('.chrome-tab');
      return $tabs.each(function(i) {
        var $tab, zIndex;
        $tab = $(this);
        zIndex = $tabs.length - i;

        if(opts.sorted) { opts.sorted($tab, i); }

        if ($tab.hasClass('chrome-tab-current')) {
          zIndex = $tabs.length + 40;
        }
        $tab.css({
          zIndex: zIndex
        });
        return $tab.data({
          zIndex: zIndex
        });
      });
    },
    setupEvents: function() {
      $shell.unbind('dblclick').bind('dblclick', function() {
        return chromeTabs.add();
      });
      return $shell.find('.chrome-tab').each(function() {
        var $tab;
        $tab = $(this);
        $tab.unbind('click').click(function() {
          return chromeTabs.setCurrent($tab);
        });
        return $tab.find('.chrome-tab-close').unbind('click').click(function() {
          var shouldClose = true;
          if(opts.shouldClose) {
              shouldClose = opts.shouldClose($tab);
          }
          if(shouldClose) {
            return chromeTabs.closeTab($tab);
          }
        });
      });
    },
    add: function(newTabData) {
      var $newTab, tabData;
      $newTab = $(tabTemplate.replace('{id}', 'codebot-tab-' + newTabData.data.id));
      $shell.find('.chrome-tabs').append($newTab);
      tabData = $.extend(true, {}, defaultNewTabData, newTabData);
      chromeTabs.updateTab($shell, $newTab, tabData);
      chromeTabs.fixZIndexes($shell);
      return chromeTabs.setCurrent($newTab);
    },
    setCurrent: function($tab) {
	  var $old = $shell.find('.chrome-tab-current');
      chromeTabs.fixZIndexes($shell);

	  $old.removeClass('chrome-tab-current');
	  if($old.length && opts.deactivated) { opts.deactivated($old); }

      $tab.addClass('chrome-tab-current');
	  if(opts.activated) { opts.activated($tab); }

      return chromeTabs.render($shell);
    },
    closeTab: function($tab) {
      if ($tab.hasClass('chrome-tab-current') && $tab.prev().length) {
        chromeTabs.setCurrent($tab.prev());
      }
	  if(opts.closed) { opts.closed($tab); }
      $tab.remove();

      return chromeTabs.render($shell);
    },
    updateTab: function($shell, $tab, tabData) {
      $tab.find('.chrome-tab-title').html(tabData.title);
      $tab.find('.chrome-tab-favicon').html('<i class="fa fa-'+tabData.favicon+'"></i>');
      return $tab.data().tabData = tabData;
    },
    getRawTabById: function(theId) {
      var ret = null;
      $shell.find('.chrome-tab').each(function() {
        var $tab;
        $tab = $(this);
        if($tab.data('tabData').data.id == theId) {
          ret = $tab;
          return false;
        }
      });
      return ret;
    },
  };

  window.chromeTabs = chromeTabs;
}).call(this);
