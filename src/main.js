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

// Import utils, ids, SDK:
const { ID }							= require( './ids' );
const {	sdks, each, CUI, cuiDo,
		watchFeature, WindowFeature }	= require('./utils');
const [ {when: unloader} ]				= sdks( ['system/unload'] );

const addButton = action => CUI.createWidget( {
	type: 'button',
	showInPrivateBrowsing: true,
	id: action[0],
	onCommand: evt => action[1]( evt.target.ownerDocument.defaultView ),
	label: ' ',
	tooltiptext: ' '
	// @TODO add labels if anyone asks for them...
} );

const destroyButton = widget => CUI.destroyWidget( widget.id );

// Apply to each window as they come:
watchFeature( WindowFeature.extend( {
	/**
	 * Applies modifications to window.
	 */
	apply() {
		// Apply movable-titlebar.css:
		const style = this.style( './movable-titlebar.css' );

		// Hide the originals:
		const root = this.doc.documentElement;
		root.setAttribute( 'movable-titlebar', true );

		// Clean up various changes when the add-on unloads:
		unloader( () => {
			// Restore originals:
			root.removeAttribute( 'movable-titlebar' );

			// Remove our style:
			this.detach( style );
		} );
	}
} ) );

// Create new buttons & unload them when needed:
const R = ID.replacement;
const news = cuiDo( news => news.map( addButton ),
	[[R.min,	window => window.minimize()],
	 [R.max,	window => window.onTitlebarMaxClick()],
	 [R.close,	window => window.BrowserTryToCloseWindow()]] );
unloader( () => each( news, destroyButton ) );