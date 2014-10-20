var args = arguments[0] || {};

// HELPERS

// pixel/dpi ratio
var pxdpi = (Ti.Platform.displayCaps.dpi / 160);

function PxToDpi(px) {
	return (px / pxdpi);
}

function DpiToPx(dpi) {
	return (dpi * pxdpi);
}

// IOS 7 marginTop
var marginTop = (OS_IOS && parseInt(Ti.Platform.version[0], 10) >= 7) ? 20 : 0;

// Drawer options
var defaults = {
	menuWidth: 250,
	ledge: 40,
	duration: 120,
	overlayShadow: true,
	win: null,
	mainView: null,
	menuView: null
};

if (args.children) {
	_.each(args.children, function(child) {
		if (!child) return;

		var role = child.role;

		if (role) {
			if (role === 'menu') defaults.menuView = child;
			if (role === 'main') defaults.mainView = child;
		}
	});
}

delete args.id;
delete args.__parentSymbol;
delete args.children;

var options = _.extend({}, defaults, args);

// assign window and views
var win = (options.win) ? options.win : Ti.UI.createWindow({
		navBarHidden: true,
		backgroundColor: '#F1F1F1',
		barColor: '#F1F1F1',
		exitOnClose: false
	}),
	mainView = (options.mainView) ? options.mainView : Ti.UI.createView({
		width: "100%",
		height: Ti.UI.FILL,
		top: 0,
		left: 0,
		backgroundColor: '#eee'
	}),
	menuView = (options.menuView) ? options.menuView : Ti.UI.createView({
		height: Ti.UI.FILL,
		top: marginTop,
		left: 0,
		backgroundColor: '#333'
	}),
	currentView = null;


mainView.width = "100%";
mainView.setZIndex(3);
menuView.setZIndex(1);
menuView.setLeft(0);
menuView.setWidth(options.menuWidth);

// define instance vars
var animating = false,
	menuOpen = false,
	curX = 0,
	deltaX = 0,
	halfWidth = (options.menuWidth / 2),
	opacityRatio = (0.8 / options.menuWidth), // 0.8 opacity
	moveHistory = {
		history: [],
		set: function(pointX) {
			var dateNow = Date.now();

			this.history.push({
				time: dateNow,
				x: pointX
			});

			while ((this.history.length > 0) && ((this.history[0].time + 300) < dateNow)) {
				this.history.shift();
			}

			if (this.history.length) {
				this.xVelocity = (pointX - this.history[0].x) / (dateNow - this.history[0].time);
				if (isNaN(this.xVelocity)) {
					this.xVelocity = 0;
				}
			} else {
				this.xVelocity = 0;
			}

			this.x = pointX;
		}
	},
	menuWrapper = Ti.UI.createView({
		width: options.ledge,
		height: Ti.UI.FILL,
		top: marginTop,
		left: 0,
		zIndex: 5
	}),
	menuOverlay = Ti.UI.createView({
		width: options.menuWidth,
		height: Ti.UI.FILL,
		top: marginTop,
		left: 0,
		zIndex: 2,
		touchEnabled: true
	});

if (options.overlayShadow) {
	menuOverlay.setBackgroundColor('#000');
	menuOverlay.setOpacity(0.8);
}

var touchStartHandler = function(e) {
	if (!animating) {
		var x = (OS_ANDROID) ? PxToDpi(e.x) : e.x;
		moveHistory.set(x);
		curX = x - mainView.left;
	}
};

var touchMoveHandler = function(e) {
	if (!animating) {
		var x = (OS_ANDROID) ? PxToDpi(e.x) : e.x;
		var tdeltaX = x - curX;
		moveHistory.set(x);

		if (tdeltaX <= options.menuWidth && tdeltaX >= 0) {
			mainView.left = tdeltaX;
			deltaX = tdeltaX;

			// if options opacity = true then
			if (options.overlayShadow) {
				var opacity = 0.8 - (opacityRatio * deltaX);

				menuOverlay.animate({
					opacity: opacity,
					duration: 0,
				});
			}
		}

		if (tdeltaX < 0) {
			mainView.left = 0;
			deltaX = 0;
		}

		if (tdeltaX > options.menuWidth) {
			mainView.left = options.menuWidth;
			deltaX = options.menuWidth;
		}
	}
};

var touchEndHandler = function(e) {
	if (!animating) {
		var x = (OS_ANDROID) ? PxToDpi(e.x) : e.x;
		moveHistory.set(x);

		// detect swipe
		if (Math.abs(moveHistory.xVelocity) > 0.15) {

			if (moveHistory.xVelocity > 0) {
				openMenu();
			} else {
				closeMenu();
			}
		} else {
			// normal end
			if (deltaX !== 0 && deltaX !== -options.menuWidth) {
				if (deltaX >= halfWidth) {
					openMenu();
				}
				if (deltaX < halfWidth) {
					closeMenu();
				}
			}

			if (deltaX === 0) setClosedMenuVars();
			if (deltaX === options.menuWidth) setOpenMenuVars();
		}
	}

	// clear movement history
	moveHistory.history = [];
};

var setOpenMenuVars = function() {
	mainView.left = options.menuWidth;
	deltaX = options.menuWidth;
	menuWrapper.width = Ti.Platform.displayCaps.platformWidth - options.menuWidth;
	menuWrapper.left = options.menuWidth;
	menuOverlay.setTouchEnabled(false);

	if (!menuOpen) {
		menuWrapper.addEventListener('singletap', closeMenu);
	}
	animating = false;
	menuOpen = true;
};

var setClosedMenuVars = function() {
	mainView.left = 0;
	deltaX = 0;
	menuWrapper.width = options.ledge;
	menuWrapper.left = 0;
	menuOverlay.setTouchEnabled(true);

	if (menuOpen) {
		menuWrapper.removeEventListener('singletap', closeMenu);
	}
	animating = false;
	menuOpen = false;
};

var openMenu = function() {
	if (!animating) {
		animating = true;
		if (options.overlayShadow) {
			menuOverlay.animate({
				opacity: 0,
				duration: options.duration,
			});
		}

		mainView.animate({
			left: options.menuWidth,
			duration: options.duration
		}, setOpenMenuVars);
	}
};

var closeMenu = function() {
	if (!animating) {
		animating = true;
		if (options.overlayShadow) {
			menuOverlay.animate({
				opacity: 0.8,
				duration: options.duration
			});
		}

		mainView.animate({
			left: 0,
			duration: options.duration
		}, setClosedMenuVars);
	}
};

// set event listeners
menuWrapper.addEventListener('touchstart', touchStartHandler);
menuWrapper.addEventListener('touchmove', touchMoveHandler);
menuWrapper.addEventListener('touchend', touchEndHandler);

// add views to window
win.add(menuOverlay);
win.add(menuWrapper);
win.add(mainView);
win.add(menuView);

// detach on close
win.addEventListener('close', function() {
	menuWrapper.removeEventListener('touchstart', touchStartHandler);
	menuWrapper.removeEventListener('touchmove', touchMoveHandler);
	menuWrapper.removeEventListener('touchend', touchEndHandler);
});

exports.changeView = function(view) {
	if (currentView === null) {
		currentView = view;
		mainView.add(view);
	} else {
		if (view.id !== currentView.id) {
			mainView.remove(currentView);
			currentView = view;
			mainView.add(view);
		}
	}

	if (menuOpen) {
		closeMenu();
	}
};

exports.toggleMenu = function() {
	if (menuOpen) {
		closeMenu();
	} else {
		openMenu();
	}
};

// window methods
_.each([
	'open',
	'close'
], function(fn) {
	if (!exports[fn]) {
		exports[fn] = function() {
			return win[fn]();
		};
	}
});

// window events
exports.on = function(event, callback) {
	return win.addEventListener(event, callback);
};

exports.off = function(event, callback) {
	return win.removeEventListener(event, callback);
};

exports.trigger = function(event, args) {
	return win.fireEvent(event, args);
};

exports.addEventListener = exports.on;
exports.removeEventListener = exports.off;
exports.fireEvent = exports.trigger;
