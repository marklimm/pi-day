
define(['knockout'], function (ko) {

    return function Person(name, votesToAdd) {

        var self = this;

        self.name = ko.observable(name);
        self.votes = ko.observable(votesToAdd);
        
        //  this Person's rank on the leaderboard
        self.rank = ko.observable('');

        self.votesToAdd = ko.observable(0);

        self.addVotesToText = ko.computed(function(){
        	return "Add " + self.votesToAdd() + " votes to " + self.name();
        })

        self.backgroundShade = ko.computed(function(){

            return self.rank() !== '' ? '#f7caca' : '#ffffff';
        });

    };

});