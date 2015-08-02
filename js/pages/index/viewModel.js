
define(['knockout', 'message', 'person', 'underscore', 'jquery', 'firebase'], 
    function (ko, Message, Person) {
    
    return function viewModel() {

        var self = this;

        self.messages = ko.observableArray();
        self.persons = ko.observableArray();


        //  the personRefs in Firebase
        self.personRefs = {};

        //  used to set alternating background colors for messages
        var messageCtr = 0;

        //  glow is turned off during initial page load
        var glowEnabled = false;

        var numManagers = 27;


        self.setRealTimeEventHandlers = function(){



            //  Firebase data reference
            var messagesRef = new Firebase('https://piechart.firebaseio.com/messages');

            var bgColor = "#ffffff";

            messagesRef.on('child_added', function (msgSnapshot) {

                var message = msgSnapshot.val()

                //  store the reference in a local JS object so that we can update/delete it from Firebase later
                //firebaseDataPoints[newDataPoint.name] = newDataPointSnapshot.ref();

                messageCtr += 1;

                if(messageCtr % 2 === 0){
                    bgColor = "#ffffff"
                }
                else{
                    bgColor = "#caccf9";
                }                


                self.messages.unshift(
                    new Message(message.text, message.timestamp, bgColor)
                    );

                var x = 5;
                //$('#tblDataPoints tbody').show();

            });




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
                        return -person.votes(); 
                    })
                );



                assignRanks();

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

                assignRanks();
            });


            peopleRef.on('child_changed', function (changedPersonSnapshot, prevPersonSnapshot) {

                glowEnabled = true;

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
                    
                        
                    //  sort the list
                    self.persons(
                        _.sortBy(self.persons(), function(person){ 
                            return -person.votes(); 
                        })
                    );


                    assignRanks();

                    $('tr[personName="' + nameToUpdate + '"]')
                        .animate({ backgroundColor: 'yellow' }, 1000)
                        .animate({ backgroundColor: person.backgroundShade() }, 1000);



                //}
            });



        }

        self.setCountdownTimer = function(){

            // set the date we're counting down to
            var target_date = new Date("Mar 14, 2014 01:00:00 PM").getTime();
 
            // variables for time units
            var days, hours, minutes, seconds;
 
            // get tag element
            var divCountdown = document.getElementById("divCountdown");
 
            // update the tag with id "divCountdown" every 1 second
            setInterval(function () {
 
                // find the amount of "seconds" between now and target
                var current_date = new Date().getTime();
                var seconds_left = (target_date - current_date) / 1000;
 
                // do some time calculations
                days = parseInt(seconds_left / 86400);
                seconds_left = seconds_left % 86400;
     
                hours = parseInt(seconds_left / 3600);
                seconds_left = seconds_left % 3600;

                minutes = parseInt(seconds_left / 60);
                seconds = parseInt(seconds_left % 60);
     
                // format countdown string + set tag value
                divCountdown.innerHTML = "pi day voting ends in " + days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds";  
 
            }, 1000);

        }

    /*
        self.glowPersonBefore = function(elem, index, data){

            if(glowEnabled && elem.nodeType === 1){
                var x = 5;
            }
        }

        self.glowPerson = function(elem, index, data){

            

            if(glowEnabled && elem.nodeType === 1){

                var currRank = index;
                if(currRank < data.rank()){
                    //  moved up in the standings

                    //  glow green
                    $(elem).animate({ backgroundColor: '#5ed15e' }, 500)
                        .animate({ backgroundColor: 'white' }, 800);

                }
                else{
                    //  moved down in the standings

                    //  glow red
                    $(elem).animate({ backgroundColor: 'red' }, 700)
                        .animate({ backgroundColor: 'white' }, 800);    
                }

                //  update the person's rank in KO
                data.rank(currRank);
                
            }
        }
        */

        self.showMessage = function(elem, index, data) {
          
            if (elem.nodeType === 1) {
                $(elem).hide()
                    .slideDown()

                    
            }

       }

        function assignRanks(){

            //  reset rank
            _.each(self.persons(), function(person){
                person.rank('');
            })

            //  assign ranks for 1st, 2nd and 3rd place
            var firstPerson = self.persons()[0];
            var secondPerson = self.persons()[1];
            var thirdPerson = self.persons()[2];

            if(firstPerson.votes() > 0){ firstPerson.rank('1st'); }
            if(secondPerson.votes() > 0){ secondPerson.rank('2nd'); }
            if(thirdPerson.votes() > 0){ 

                thirdPerson.rank('3rd'); 

                //  set users who are tied for 3rd place
                setTiedForThirdPlace(thirdPerson);
            }


            var lastPerson = self.persons()[self.persons().length - 1];

            //  only award a last place if we've also awarded a first place.  If no one has votes yet, don't award last place
            if(firstPerson.votes() > 0){
                lastPerson.rank('Last');

                setTiedForLastPlace(lastPerson);
            }


            
        }

        function setTiedForThirdPlace(thirdPerson){

            var thirdPlaceVotes = thirdPerson.votes();

            _.each(self.persons(), function(person, index){
                if(index > 2 && person.votes() === thirdPlaceVotes){
                    person.rank('3rd');
                }
            })
        }


        function setTiedForLastPlace(lastPerson){

            var lastPlaceVotes = lastPerson.votes();


            _.each(self.persons(), function(person, index){
                if(person.votes() === lastPlaceVotes){
                    person.rank('Last');
                }
            })
        }


    };

});