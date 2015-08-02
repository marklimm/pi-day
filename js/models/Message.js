
define(['knockout'], function (ko) {

    return function Message(text, timestamp, bgColor) {

        var self = this;

        self.text = text;
        self.timestamp = timestamp;
        self.bgColor = bgColor;
        
/*
        self.displayMessage = function(){
            
            return self.text + " [" + self.timestamp + "]";
        }
*/



        self.showMessage = function(elem) { 

            if (elem.nodeType === 1) 
                $(elem).hide().slideDown() 
        }
        

    };

});