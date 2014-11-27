define(function (require) {

	'use strict';

	var LevelModel = require('app/models/level');

	return Backbone.Collection.extend({
		url: '/level',
		model: LevelModel,

		sortByComplexity : function(){
			this.comparator = function(model) {
				return model.get('complexity');
			}

			this.sort();
		}
	});

});