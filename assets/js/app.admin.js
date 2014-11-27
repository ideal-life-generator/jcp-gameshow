require(
  [
	'polyglot_boot',
    'app/actions/admin/user.list',
    'app/actions/admin/user.add',
    'app/actions/admin/user.edit',
    'app/actions/admin/user.del',
    'app/actions/admin/settings.list',
    'app/actions/admin/category.list',
    'app/actions/admin/category.add',
    'app/actions/admin/category.edit',
    'app/actions/admin/category.del',
    'app/actions/admin/question.list',
    'app/actions/admin/question.add',
    'app/actions/admin/question.edit',
    'app/actions/admin/question.del',
    'app/actions/not_found'
  ],
  function(
    polyglot,
    userList,
    userAdd,
    userEdit,
    userDel,
	settingsList,
    categoryList,
    categoryAdd,
    categoryEdit,
    categoryDel,
    questionList,
    questionAdd,
    questionEdit,
    questionDel,
    notFound
    ) {
    'use strict';

    new (Backbone.Router.extend({
      routes: {
        '': userList,
        'user': userList,
        'user/add': userAdd,
        'user/edit/:id': userEdit,
        'user/delete/:id': userDel,
        'category': categoryList,
        'settings': settingsList,
        'category/add': categoryAdd,
        'category/edit/:id': categoryEdit,
        'category/delete/:id': categoryDel,
        'question': questionList,
        'question/add': questionAdd,
        'question/edit/:id': questionEdit,
        'question/delete/:id': questionDel,
        '*default': notFound
      },
      initialize: function() {

        Backbone.history.start();
      }
    }));

  }
);