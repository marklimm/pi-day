


require.config({
    baseUrl: 'js/',
    paths: {

        //  third-party libraries
        'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
        //'knockout.deprecated': 'lib/knockout/knockout-doesnt-exist',
        'knockout': 'lib/knockout/knockout-3.0.0',

        'underscore': 'lib/underscore/underscore-min',
        //'parse': 'http://www.parsecdn.com/js/parse-1.1.15.min',
        'firebase': 'https://cdn.firebase.com/js/client/1.0.2/firebase',


        //  bringing in bootstrap JS via the CDN
        'bootstrap': 'http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min',

        'jqueryColor': 'lib/jQueryColor/jquery.color-2.1.2.min',        

        //  model objects
        'person': 'models/Person',
        'message': 'models/Message',
        //'post': 'models/Post',
        
        'viewModel': 'pages/index/viewModel',
        //'viewThread': 'pages/index/viewThread'

    },

    shim: {
        'bootstrap': ['jquery'],
        'jqueryColor': ['jquery']
    },
    
    urlArgs: "run 03/04/14_2"
});




require(['viewModel', 'knockout', 'jquery', 'jqueryColor', 'bootstrap'], function (Viewmodel, ko) {

    var vm = new Viewmodel();
    
    $(function () {


        vm.setRealTimeEventHandlers();

        //vm.setCountdownTimer();

        ko.applyBindings(vm);


    });

});