'use strict';

var _ = require('underscore');

/**
 * Top level integers are complexity levels.
 */
var questions = {
	1 : [
		{
			question: 'Which ISO application area does this symbol represent?',
			versionA: 'Cast iron',
			versionB: 'Heat-Resistant Super Alloys',
			versionC: 'Stainless',
			versionD: 'Steel',
			correct: ['d']
		},
		{
			question: 'Which picture shows longitudinal turning?',

		},
		{
			question: 'What does V<sub>c</sub> stand for?',
			versionA: 'Cutting speed',
			versionB: 'Spindle speed',
			versionC: 'Feed per revolution',
			versionD: 'Angle of entry',
			correct: ['a']
		},
		{
			question: 'Which picture shows step drilling?',
			versionA: 'Drilling',
			versionB: 'Trepanning',
			versionC: 'Chamfer drilling',
			versionD: 'Step drilling',
			correct: ['d']
		},
		{
			question: 'What is this milling method called?',

		}
	]

};

module.exports = (function (questions) {
	'use strict';

	return questions;

})(questions);