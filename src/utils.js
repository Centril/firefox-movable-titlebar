/*
 * Movable Titlebar Buttons, a Firefox Addon/Extension,
 * allows you to move the titlebar buttons on Windows 10.
 *
 * Copyright (C) 2015 Mazdak Farrokhzad <twingoow@gmail.com>, Mozilla Labs
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
'use strict';

// -------------------------------------------------------------------------
// SDK & JSM Loading:
// -------------------------------------------------------------------------

/**
 * Returns a list of SDKs.
 *
 * @param  {String[]}  list  A string list of sdks without 'sdk/' path prefix.
 * @return {Object[]}        The SDKs.
 */
const sdks = list => list.map( v => require( `sdk/${v}` ) );
exports.sdks = sdks;

const requireJSM = jsm => require( `resource://${jsm}.jsm` );
exports.requireJSM = requireJSM;

// -------------------------------------------------------------------------
// Load everything this unit needs:
// -------------------------------------------------------------------------

// Get CUI, Services:
const { CustomizableUI: CUI } = requireJSM( '/modules/CustomizableUI' );
exports.CUI = CUI;

const [ window_utils, {browserWindows: windows},
		{viewFor}, {when: unloader}, {partial, delay},
		{Class: _class, mix}, {attachTo, detachFrom}, {Style},
		{isArray}] = sdks(
	  [ 'window/utils', 'windows',
	    'view/core', 'system/unload', 'lang/functional',
	    'core/heritage', 'content/mod', 'stylesheet/style',
	    'lang/type'] );

// -------------------------------------------------------------------------
// General purpose functions:
// -------------------------------------------------------------------------

const each = (obj, fn) => {
	if ( isArray( obj ) ) return obj.forEach( fn );
	Object.keys( obj ).forEach( k => fn( k, obj[k] ) );
};
exports.each = each;

// -------------------------------------------------------------------------
// Windows:
// -------------------------------------------------------------------------

/**
 * Executes fn, passed args and
 * registers unload that is called with args on unload.
 *
 * @param  {Function}  fn     The function to call.
 * @param  {Function}  unload The function to unload what fn did with.
 * @param  {...*} args        The arguments to pass to fn & unload.
 */
const unloadable = (fn, unload, ...args) => {
	fn( ...args );
	unloader( partial( unload, args ) );
};
exports.unloadable = unloadable;

/**
 * Apply a callback to each open and new browser windows.
 *
 * @usage watchWindows( callback ): Apply a callback to each browser window.
 * @param {function} callback: 1-parameter function that gets a browser window.
 */
const watchWindows = callback => {
	// Add functionality to existing windows
	each( window_utils.windows( 'navigator:browser', {includePrivate: true} ), callback );

	// Watch for new browser windows opening:
	unloadable( l => windows.on( 'open', l ), l => windows.off( 'open', l ),
		w => callback( viewFor( w ) ) );
}
exports.watchWindows = watchWindows;

/**
 * Asynchronously apply a callback to each open and new browser windows.
 *
 * @usage watchWindowsAsync( callback ): Apply a callback to each browser window.
 * @param {function} callback: 1-parameter function that gets a browser window.
 */
const watchWindowsAsync = callback =>
	watchWindows( window => delay( () => callback( window ), 0 ) );
exports.watchWindowsAsync = watchWindowsAsync;

// -------------------------------------------------------------------------
// CUI:
// -------------------------------------------------------------------------

/**
 * Executes fn in a CUI batch update.
 *
 * @param  {Function} fn The function to execute.
 * @return {*}           Whatever fn returns.
 */
const cuiDo = (fn, ...args) => {
	try {
		CUI.beginBatchUpdate();
		return fn( ...args );
	} finally {
		CUI.endBatchUpdate();
	}
};
exports.cuiDo = cuiDo;

// -------------------------------------------------------------------------
// WindowFeature:
// -------------------------------------------------------------------------

/**
 * WindowFeature, a helper for a per window addon feature:
 */
const WindowFeature = _class( {
	/**
	 * Constructor:
	 *
	 * @param  {ChromeWindow} window The Window.
	 */
	initialize( window ) {
		this.window = window;
		this.doc = window.document;
	},

	/**
	 * Applies the style given by uri.
	 *
	 * @param  {String} uri the URI of the style CSS file.
	 * @return {Style}      the style attachment, to unload later.
	 */
	style( uri ) {
		return this.attach( new Style( { uri: uri } ) );
	},

	/**
	 * Attaches a modification to our window.
	 *
	 * @param  {*} mod  The modification to attach.
	 * @return {*}      The argument mod.
	 */
	attach( mod ) { attachTo( mod, this.window ); return mod; },

	/**
	 * Detaches a modification from our window.
	 *
	 * @param  {*} mod  The modification to detach.
	 * @return {null}   Null.
	 */
	detach( mod ) { detachFrom( mod, this.window ); return null; },
} );

WindowFeature.extend = proto => _class( mix( proto, { extends: WindowFeature } ) );

exports.WindowFeature = WindowFeature;

/**
 * Watch a WindowFeature, applying it async as windows come.
 *
 * @param  {WindowFeature} f The WindowFeature, expecting a function apply on prototype.
 */
const watchFeature = f => watchWindowsAsync( window => f( window ).apply() );
exports.watchFeature = watchFeature;