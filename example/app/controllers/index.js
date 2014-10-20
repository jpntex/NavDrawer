$.navDrawer.open();

// open first view
openExplore();

Alloy.Globals.navDrawer = $.navDrawer;

// menu
function openProfile() {
	var view = Alloy.createController('profile').getView();
	$.navDrawer.changeView(view);
}

function openExplore() {
	var view = Alloy.createController('explore').getView();
	$.navDrawer.changeView(view);
}

function openShop() {
	var view = Alloy.createController('shop').getView();
	$.navDrawer.changeView(view);
}

function openHome(e) {
	e.cancelBubble = true;
	openExplore();
}

if (OS_ANDROID) {
	$.navDrawer.on('android:back', openHome);
}
