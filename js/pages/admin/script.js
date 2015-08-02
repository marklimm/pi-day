


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
        'firebaseSimpleLogin': 'https://cdn.firebase.com/js/simple-login/1.2.5/firebase-simple-login',


        //  bringing in bootstrap JS via the CDN
        'bootstrap': 'http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min',
        

        //  model objects
        'person': 'models/Person',
        'messageSaver': 'models/MessageSaver',
        'personSaver': 'models/PersonSaver',

        'viewModel': 'pages/admin/viewModel',
        

    },

    shim: {
        'bootstrap': ['jquery']
    },
    
    urlArgs: "run 03/04/14_2"
});




require(['viewModel', 'knockout', 'jquery', 'bootstrap'], function (Viewmodel, ko, Thread) {

    var vm = new Viewmodel();
    
    $(function () {


        vm.setupFirebaseAuthentication();

        vm.setRealTimeEventHandlers();
        //vm.loadUpMessages();

        ko.applyBindings(vm);

    });

});