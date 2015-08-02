
define(['firebase'], function () {

    return function MessageSaver() {

        var self = this;


        var messagesRef = new Firebase('https://piechart.firebaseio.com/messages');


/*
        self.saveAddedPersonNewsToFirebase = function(name, votes){

            saveNewsToFirebase(name + " has received " + votes + " votes for a total of " + votes + " votes");
        }*/

        self.saveGotVotesMsgToFirebase = function(name, votes, votesToAdd){

            saveNewsToFirebase('<b>' + name + "</b> has received " + votesToAdd + " votes and has a total of " + (votes + votesToAdd) + " votes");   
        }

        function saveNewsToFirebase(messageText) {

            var currTime = new Date();

            messagesRef.push({
                'text': messageText,
                'timestamp': currTime.toDateString() + " " + currTime.toLocaleTimeString()
                }, function () {
                    //  this success event handler doesn't always fire
                    //alert("success: " + success);

            });



        }


    };

});