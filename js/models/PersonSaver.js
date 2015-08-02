
define(['firebase'], function () {

    return function PersonSaver() {

        var self = this;


        var peopleRef = new Firebase('https://piechart.firebaseio.com/people');



            
        self.updatePersonInFirebase = function(name, votes, votesToAdd, personToUpdateRef) {

            //  update in Firebase
            personToUpdateRef.set({
                'name': name,
                'votes': votes + votesToAdd,
                'lastUpdated': getLastUpdatedDate()
            }, function(error){            });

            return true;
        }

        self.saveNewPersonToFirebase = function(name, votes) {

            if(!name){ return ;}

            peopleRef.push({
                'name': name,
                'votes': votes,
                'lastUpdated': getLastUpdatedDate()
                }, function () {
                    //  this function has no parameters


                }
            );

            return true;


        }

        self.deletePersonFromFirebase = function(personToDeleteRef){
                        
            personToDeleteRef.remove();
        }



        function getLastUpdatedDate(){

            var currTime = new Date();
            var currDate= (currTime.getMonth() + 1) + "/" + currTime.getDate() + "/" + currTime.getFullYear();
            return currDate + " " + currTime.toLocaleTimeString();
        }
    };

});