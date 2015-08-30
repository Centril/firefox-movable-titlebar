var self = require('sdk/self');

const titlebarButtonsMagic = window => {
	// Create all ActionButtons:
	const byId = id => window.document.getElementById( id );
	const ID_PREFIX = 'action-button--firefox-line-';
	const ICON_BASE = 'chrome://browser/skin/caption-buttons.svg#';
	const makeIcon = (motive, mode) => ['16', '32', '64'].reduce( (l, s) => {
			l[s] = `${ICON_BASE}${motive}${mode}`;
			return l;
		}, {} );
	const iconRef = {
		'titlebar-min': 'minimize',
		'titlebar-max': 'maximize',
		'titlebar-close': 'close'
	};
	const news = [
		ui.ActionButton( {
			id:		'titlebar-min',
			label:	'Minimize',
			icon:	makeIcon( 'minimize', '-white' ),
			onClick: () => window.minimize()
		} ),
		ui.ActionButton( {
			id:		'titlebar-max',
			label:	'Maximize',
			icon:	makeIcon( 'maximize', '-white' ),
			onClick: window.onTitlebarMaxClick
		} ),
		ui.ActionButton( {
			id:		'titlebar-close',
			label:	'Close',
			icon:	makeIcon( 'close', '-white' ),
			onClick: window.BrowserTryToCloseWindow
		} )
	];

	// Move them to after Menu button:
	const menu = byId( 'PanelUI-menu-button' );
	news.reverse().forEach( ab => menu.parentNode.insertBefore( byId( ID_PREFIX + ab.id ), menu.nextSibling ) );

	const CUI = window.CustomizableUI;
//	CUI.addWidgetToArea( 'titlebar-min', CUI.AREA_PANEL );

	CUI.addListener( {
        onWidgetAdded: function(aWidgetId, aArea, aPosition) {
            console.log('a widget moved to an area, arguments:', arguments);

        },
        onWidgetDestroyed: function(aWidgetId) {
            console.log('a widget destroyed so removing listener, arguments:', arguments);
        }
	} );

	// Observe if they are moved, and change icon acordingly:
	const panelUI = byId( 'PanelUI-contents' );
	const inMenuPanel = button => panelUI.querySelector( '#wrapper-' + ID_PREFIX + button.id );
	const setIcon = (button, mode) => button.state( 'window', { icon: makeIcon( iconRef[button.id], mode ) } );
	const iconsHandler = () => news.forEach( ab => {
		console.log( 'inMenuPanel( ab ): ' + inMenuPanel( ab ) );
		setIcon( ab, inMenuPanel( ab ) ? '' : '-white' );
	} );

	const observer = new window.MutationObserver( iconsHandler );
//	observer.observe( panelUI, { childList: true } );
	iconsHandler();




	// Hide the originals:
	const setDisplay = (e, value) => { e.style.display = value; return e; };
//	const originals = ['titlebar-buttonbox-container', 'titlebar-placeholder-on-TabsToolbar-for-captions-buttons']
//		.map( id => setDisplay( byId( id ), "none" ) );

	// Add unloader.
	unloader( () => {
		// Restore originals:
		originals.forEach( e => setDisplay( e, "moz-box" ) );

		// Destroy new ones:
		news.forEach( ab => ab.destroy() );

		// Stop recieving events:
		observer.disconnect();
	}, window );
}

// Plugin entry point:
const main = () => watchWindows( window => async( partial( titlebarButtonsMagic, window ) ) );

main();

// Clean up with unloaders when we're deactivating:
require("sdk/system/unload").when( reason => unload() );