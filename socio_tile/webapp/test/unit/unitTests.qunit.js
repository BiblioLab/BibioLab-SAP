/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Socio/socio_tile/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
