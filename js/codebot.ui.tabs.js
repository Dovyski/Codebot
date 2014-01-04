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
*/


// NOTE: original code has been modified by Fernando Bevilacqua <dovyski@gmail.com>


(function() {
  var $, chromeTabs, defaultNewTabData, tabTemplate, $shell, opts;
  $ = jQuery;
  if (document.body.style['-webkit-mask-repeat'] !== void 0) {
    $('html').addClass('cssmasks');
  } else {
    $('html').addClass('no-cssmasks');
  }
  tabTemplate = '<div class="chrome-tab">\n    <div class="chrome-tab-favicon"></div>\n    <div class="chrome-tab-title"></div>\n    <div class="chrome-tab-close"></div>\n    <div class="chrome-tab-curves">\n        <div class="chrome-tab-curve-left-shadow2"></div>\n        <div class="chrome-tab-curve-left-shadow1"></div>\n        <div class="chrome-tab-curve-left"></div>\n        <div class="chrome-tab-curve-right-shadow2"></div>\n        <div class="chrome-tab-curve-right-shadow1"></div>\n        <div class="chrome-tab-curve-right"></div>\n    </div>\n</div>';
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
          return chromeTabs.closeTab($shell, $tab);
        });
      });
    },
    add: function(newTabData) {
      var $newTab, tabData;
      $newTab = $(tabTemplate);
      $shell.find('.chrome-tabs').append($newTab);
      tabData = $.extend(true, {}, defaultNewTabData, newTabData);
      chromeTabs.updateTab($shell, $newTab, tabData);
      return chromeTabs.setCurrent($newTab);
    },
    setCurrent: function($tab) {
	  var $old = $shell.find('.chrome-tab-current');
      
	  $old.removeClass('chrome-tab-current');
	  if($old.length && opts.deactivated) { opts.deactivated($old); }
	  
      $tab.addClass('chrome-tab-current');
	  if(opts.activated) { opts.activated($tab); }
	  
      return chromeTabs.render($shell);
    },
    closeTab: function($shell, $tab) {
      if ($tab.hasClass('chrome-tab-current') && $tab.prev().length) {
        chromeTabs.setCurrent($tab.prev());
      }
	  if(opts.closed) { opts.closed($tab); }
      $tab.remove();
	  
      return chromeTabs.render($shell);
    },
    updateTab: function($shell, $tab, tabData) {
      $tab.find('.chrome-tab-title').html(tabData.title);
      $tab.find('.chrome-tab-favicon').css({
        backgroundImage: "url('" + tabData.favicon + "')"
      });
      return $tab.data().tabData = tabData;
    }
  };
  
  window.chromeTabs = chromeTabs; 
}).call(this);
