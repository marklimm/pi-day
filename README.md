# pi-day
A leaderboard application for OPIS's 3/14 "pi" day "pie in the face" contest

At a previous job (OPIS) there was a 3/14 "pi" day "pie in the face" contest where employees could buy votes to vote for which manager they wanted to have get a pie thrown in their face!  I was contacted by the POC for the pie sign in contest and took direction directly from her as far as what the requirements for the app would be.  The UI was entirely designed and implemented by myself.  It was very well-received and participants were able to get real-time updates on the vote tallies for the contest, which helped to drive enthusiasm and vote purchases for the event.  In previous years, the contest POC would send out occasional emails with a pie chart of the vote tallies.  This application is a real-time leaderboard implemented with knockoutJS, using firebase as a real-time backend.  

The main page displays the leaderboard itself - clearly illustrating the rules that all managers in 1st, 2nd, 3rd, or last place would get a pie in the face :) - as well as a real-time "news feed" of votes as they were being tallied.  There is also a countdown timer, counting down the days, hours, minutes and seconds before the end of voting.  Firebase authentication is used to authenticate the admin

There is also an admin portion for adding to the vote tallies
![Image of admin_leaderboard](https://raw.githubusercontent.com/marklimm/pi-day/master/images/admin_leaderboard.png)

Tech stack: knockoutJS, requireJS, firebase, underscore
