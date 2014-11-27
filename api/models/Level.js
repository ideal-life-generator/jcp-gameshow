'use strict';

/**
 * Model for complexity level.
 * Is not actually saved in the db.
 */
var Level = {

	EASY : 'easy',
	MEDIUM : 'medium',
	HARD : 'hard',
	TRAINING : 'training',

	/**
	 * Get list of available lists.
	 */
	getList: function(){
		return {
			'easy' : 'Easy',
			'medium' : 'Medium',
			'hard' : 'Hard',
			'training' : 'Training'
		};
	}

};

module.exports = Level;
