
define(['knockout', 'person', 'messageSaver', 'personSaver', 'underscore', 'jquery', 'firebase', 'firebaseSimpleLogin'], 
    function (ko, Person, MessageSaver, PersonSaver) {
    
    return function viewModel() {

        var self = this;


        self.authClient = null;
        self.loggedInUser = ko.observable('');


        self.messages = ko.observableArray();
        self.persons = ko.observableArray();


        //  the personRefs in Firebase
        self.personRefs = {};

        //  adding a new person/votes entry
        self.newName = ko.observable('');
        self.newPersonVotes = ko.observable('');

        self.displayControls = ko.observable(false);


        var numManagers = 27;

        //  helper classes
        var messageSaver = new MessageSaver();
        var personSaver = new PersonSaver();


        self.persons.subscribe(function(newValue, second) {
            //alert("The person's new name is " + newValue);
            var x = 5;
        });


        self.setupFirebaseAuthentication = function () {

            
            self.authClient = new FirebaseSimpleLogin(pieChartRef, function (error, user) {
                if (error) {
                    // an error occurred while attempting login
                    // console.log(error);

                    $('#btnLogin').button('reset');

                    $('#lblInvalidLogin').fadeIn(200);
                } else if (user) {
                    // user authenticated with Firebase
                    // console.log('User ID: ' + user.id + ', Provider: ' + user.provider);

                    $('#btnLogin').button('reset');

                    $('#divNotLoggedIn').fadeOut(500, function () {
                        $('#divLoggedIn').fadeIn(500);
                    });

                    //self.readonlyMode(false);
                    self.loggedInUser(user.email);

                    $('#lblInvalidLogin').hide();

                    self.displayControls(true);
                } else {
                    // user is logged out

                    $('#divLoggedIn').fadeOut(500, function () {
                        $('#divNotLoggedIn').fadeIn(500);
                    });

                    self.displayControls(false);
                    self.loggedInUser('');
                }
            });

        }

        self.loginClicked = function () {

            $('#btnLogin').button('loading');

            var username = $.trim($('#txtUsername').val());
            var password = $.trim($('#txtPassword').val());

            self.authClient.login('password', {
                email: username,
                password: password
            });
        }
        
        self.logoutClicked = function () {

            self.authClient.logout();
        }



        self.setRealTimeEventHandlers = function(){



            //  Firebase data reference
            var peopleRef = new Firebase('https://piechart.firebaseio.com/people');

            peopleRef.on('child_added', function (personSnapshot) {

                var person = personSnapshot.val()


                //  store the reference in a local JS object so that we can update/delete it from Firebase later
                self.personRefs[person.name] = personSnapshot.ref();

                self.persons.push(new Person(person.name, person.votes));


                //  don't both executing the below code if not enough managers have been loaded in yet
                if(self.persons().length < numManagers){ return ;}

                //  sort the list
                self.persons(
                    _.sortBy(self.persons(), function(person){ 
                        return person.name();
                    })
                );



                var x = 5;
                //$('#tblDataPoints tbody').show();

            });


            peopleRef.on('child_removed', function (removedPersonSnapshot) {

                var personToDelete = removedPersonSnapshot.val().name;

                //  delete from person Firebase references
                delete self.personRefs[personToDelete];

                //  find the corresponding data point in the chart
                //var foundDataPoint = _.find(self.chart.series[0].data, function (dp) { return dp.name === nameToDelete });

                //if (foundDataPoint) {

                    //  remove the point from the chart
                    //foundDataPoint.remove()
    
                    //  remove the point from KO
                    self.persons.remove(function (person) { return person.name() === personToDelete });
                    
                //}


            });


            peopleRef.on('child_changed', function (changedPersonSnapshot, prevPersonSnapshot) {

                var nameToUpdate = changedPersonSnapshot.val().name;
                var votesToUpdate = changedPersonSnapshot.val().votes;

                //  find the corresponding data point in the chart
                //var foundDataPoint = _.find(self.chart.series[0].data, function (dp) { return dp.name === nameToUpdate });

                //if (foundDataPoint) {

                    //  update the chart
                    //foundDataPoint.update(valueToUpdate);

                    //  update KO
                    var person = _.find(self.persons(), function (person) { return person.name() === nameToUpdate });

                    person.votes(votesToUpdate);
                    
                    
                //}
            });

        }

        self.blurNewPersonHandler = function(data, event){

            var newName = self.newName();
            var votesToAdd = self.newPersonVotes();

            votesToAdd = getValueAsInt(votesToAdd);
            if(!votesToAdd && votesToAdd !== 0){ return ; }

            if(personSaver.saveNewPersonToFirebase(newName, votesToAdd)){

                //messageSaver.saveAddedPersonNewsToFirebase(newName, votesToAdd);
                messageSaver.saveGotVotesMsgToFirebase(newName, 0, votesToAdd);
                
            }

            //  clear the input fields
            self.newName('');
            self.newPersonVotes('');

            //  this doesn't seem to work, but now it does for some reason
            $('input#txtNewName').focus();

            //  the default key action should occur
            return false;
        }

        self.addVotesHandler = function(data, event){


            var personToUpdateRef = self.personRefs[data.name()];

            var currVotes = data.votes();
            var votesToAdd = data.votesToAdd();

            votesToAdd = getValueAsInt(votesToAdd);
            if(!votesToAdd){ return ; }

            if(personSaver.updatePersonInFirebase(data.name(), currVotes, votesToAdd, personToUpdateRef)){

                messageSaver.saveGotVotesMsgToFirebase(data.name(), currVotes, votesToAdd);
            }

            //  reset to 0
            data.votesToAdd(0);

            //  the default key action should occur
            //return true;
        }

        self.deletePersonHandler = function(data, event){

            if(!confirm('are you sure that you want to delete ' + data.name() + "?")){ return ;}

            var personToDeleteRef = self.personRefs[data.name()];

            personSaver.deletePersonFromFirebase(personToDeleteRef);


        }


        function getValueAsInt(givenValue) {

            var value = parseInt(givenValue);

            if (isNaN(value)) {
                return false;
            }
            else {
                return value;
            }
        }

    };

});