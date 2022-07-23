/*global QUnit*/

sap.ui.define([
	"socio/controller/Socio.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Socio Controller");

	QUnit.test("I should test the Socio controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
