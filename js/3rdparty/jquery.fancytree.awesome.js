/*!
 * jquery.fancytree.awesome.js
 *
 * Use glyph fonts as instead of icon sprites.
 * (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
 *
 * Copyright (c) 2013, Martin Wendt (http://wwWendt.de)
 *
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version DEVELOPMENT
 * @date DEVELOPMENT
 *
 * Adaptation: Fernando Bevilacqua <dovyski@gmail.com>
 */

;(function($, window, document, undefined) {

"use strict";

/* *****************************************************************************
 * Private functions and variables
 */

function _getIcon(opts, type){
	return opts.map[type];
}

$.ui.fancytree.registerExtension({
	name: "awesome",
	version: "0.0.1",
	// Default options for this extension.
	options: {
		prefix: "icon-",
		extra: null,
		map: {
			doc: "fa fa-file-text-o",
			docOpen: "fa fa-file-text",
			checkbox: "fa fa-square-o",
			checkboxSelected: "fa fa-check-square-o",
			checkboxUnknown: "fa fa-square",
			error: "fa fa-exclamation-triangle",
			expanderClosed: "fa fa-caret-right",
			expanderLazy: "fa fa-angle-right",
			// expanderLazy: "icon-refresh icon-spin",
			expanderOpen: "fa fa-caret-down",
			folder: "fa fa-folder",
			folderOpen: "fa fa-folder-open",
			loading: "fa fa-refresh fa-spin"
		},
		icon: null // TODO: allow callback here
	},
	// Overide virtual methods for this extension.
	// `this`       : is this extension object
	// `this._super`: the virtual function that was overriden (member of prev. extension or Fancytree)
	treeInit: function(ctx){
		var tree = ctx.tree;
		this._super(ctx);
		tree.$container.addClass("fancytree-ext-awesome");
	},
	nodeRenderStatus: function(ctx) {
		var icon, span,
			node = ctx.node,
			opts = ctx.options.awesome,
			// callback = opts.icon,
			map = opts.map
			// prefix = opts.prefix
			// $span = $(node.span)
			;

		this._super(ctx);

		if( node.isRoot() ){
			return;
		}
		if( node.hasChildren() !== false ){
			span = $("span.fancytree-expander", node.span).get(0);
			if( span ){
				/*if( node.isLoading ){
					icon = "loading";
				}else*/ if( node.expanded ){
					icon = "expanderOpen";
				}else if( node.lazy && node.children == null ){
					icon = "expanderLazy";
				}else{
					icon = "expanderClosed";
				}
				// icon = node.expanded ? "expanderOpen" : (node.lazy && node.children == null) ? "expanderLazy" : "expanderClosed";
				span.className = "fancytree-expander " + map[icon];
			}
		}
		span = $("span.fancytree-checkbox", node.span).get(0);
		if( span ){
			icon = node.selected ? "checkboxSelected" : (node.partsel ? "checkboxUnknown" : "checkbox");
			span.className = "fancytree-checkbox " + map[icon];
		}
		span = $("span.fancytree-icon", node.span).get(0);
		// if( callback && callback(node))
		if( span ){
			if( node.folder ){
				icon = node.expanded ? _getIcon(opts, "folderOpen") : _getIcon(opts, "folder");
			}else{
				icon = node.expanded ? _getIcon(opts, "docOpen") : _getIcon(opts, "doc");
			}
			span.className = "fancytree-icon " + icon;
		}
	},
	nodeSetStatus: function(ctx, status, message, details) {
		var span,
			opts = ctx.options.awesome,
			node = ctx.node;

		this._super(ctx, status, message, details);

		if(node.parent){
			span = $("span.fancytree-expander", node.span).get(0);
		}else{
			span = $("span.fancytree-statusnode-wait, span.fancytree-statusnode-error", node.span).find("span.fancytree-expander").get(0);
		}
		if( status === "loading"){
			// $("span.fancytree-expander", ctx.node.span).addClass(_getIcon(opts, "loading"));
			span.className = "fancytree-expander " + _getIcon(opts, "loading");
		}else if( status === "error"){
			span.className = "fancytree-expander " + _getIcon(opts, "error");
		}
	}
});
}(jQuery, window, document));
