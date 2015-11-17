var Calendar = Calendar || {
    //Modified with event tracking code
    version: 1.4,
    lunarPhaseSize: 15,
    lunarPhasesImage: 'https://s3.amazonaws.com/files.d20.io/images/4277527/CJJWBbiHx3jHglPdccPx3A/max.png?1401939451',
    clearImage: 'https://s3.amazonaws.com/files.d20.io/images/4277467/iQYjFOsYC5JsuOPUCI9RGA/max.png?1401938659',

    _Ordinal: function(num) {
        var ones=(num%10);
        var tens=((num%100)-ones);
        switch(ones)
        {
            case 1: return ((10 == tens) ? 'th' : 'st');
            case 2: return ((10 == tens) ? 'th' : 'nd');
            case 3: return ((10 == tens) ? 'th' : 'rd');
            default: return 'th';
        }
    },
    
    _GetOptionsFromTokens: function (tokens) {
        var options={};
        var switches=_.filter(tokens, function(tok){
            return null != tok.match(/^--/);
        });
        _.each(switches,function(s){
            switch(s)
            {
                case '--lunar': options.showLunarPhases=true; break;
                case '--nolunar': options.showLunarPhases=false; break;
                
            }
        });
        
       return options;
    },

    CheckInstall: function() {    
        if( ! state.hasOwnProperty('Calendar') || state.Calendar.version != Calendar.version)
        {
            /* Default Settings stored in the state. */
            state.Calendar = {
                version: Calendar.version,
                now: {
                    year: 1001,
                    month: 12,
                    day: 4
                },
                setting: {
                    daysOfTheWeek: [
                        'Lunadain',
                        'Gromdain',
                        'Tserdain',
                        'Moldain',
                        'Nytdain',
                        'Loshdain',
                        'Soladain'],
                    weeksOfTheMonth: [1,2,3,4],
                    monthsOfTheYear: [
                        'Nuwmont',
                        'Vatermont',
                        'Thaumont',
                        'Flaurmont',
                        'Yarthmont',
                        'Klarmont',
                        'Felmont',
                        'Fyrmont',
                        'Ambyrmont',
                        'Sviftmont',
                        'Eirmont',
                        'Kaldmont'],
                    yearPrefix: 'AC '
                },
    			events: []
            }
        }
    },
    
    AdvanceDays: function(days){
        var y=Math.floor(days/336);
        days-=(y*336);
        var m = Math.floor(days/28);
        days-=(m*28);
        
        var n = state.Calendar.now;
        
        n.day+=days;
        var _m=Math.floor((n.day-1)/28);
        n.day-=(_m*28);
        m+=_m;
        
        n.month+=m;
        var _y=Math.floor((n.month-1)/12);
        n.month-=(_y*12);
        y+=_y;
        
        n.year+=y;
        
        state.Calendar.now=n;
    },
    
    RemoveDays: function(days){
        var y=Math.floor(days/336);
        days-=(y*336);
        var m = Math.floor(days/28);
        days-=(m*28);
        
        var n = state.Calendar.now;
        
        n.day-=days;
        var _m=((n.day>0)?(0):(1));
        n.day+=(_m*28);
        m+=_m;
        
        n.month-=m;
        var _y=((n.month>0)?(0):(1));
        n.month+=(_y*12);
        y+=_y;
        
        n.year-=y;
        
        state.Calendar.now=n;
    },
    
    _GetPhaseForDate: function(d,options){
        var opt=_.defaults((options||{}),{
            showLunarPhases: true
        });
        return ((opt.showLunarPhases)?(
        '<img src="'
            +Calendar.clearImage
            +'" style="width: '+Calendar.lunarPhaseSize+'px; height: '+Calendar.lunarPhaseSize+'px; background:url('
            +Calendar.lunarPhasesImage
            +') -'+((d.day-1)%7)*Calendar.lunarPhaseSize+'px -'+Math.floor((d.day-1)/7)*Calendar.lunarPhaseSize+'px;">'
            ):('')); 
    },
    
    _GetDayForDate: function(d,options){
        var opt=_.defaults((options||{}),{
        });
        
        var n=state.Calendar.now;
        var img = Calendar._GetPhaseForDate(d,opt)
        
        if(d.year == n.year && d.month == n.month && d.day == n.day)
        {
            return '<div style="white-space: nowrap;">'
                    +'<span style="font-weight: bold; color: #990000;">'
                        +d.day
                    +'</span>'
                    +img
                +'</div>';
        }
        else if( (d.year < n.year) 
        || ( (d.year <= n.year) && (d.month<n.month)) 
        || ( (d.year <= n.year) && (d.month<=n.month) && (d.day<n.day)) )
        {
            return '<div style="white-space: nowrap;">'
                    +'<strike style="color:red; font-weight: bold;">'
                        +'<span style="font-weight:bold; color:#999999;">'
                            +d.day
                        +'</span>'
                    +img
                    +'</strike>'
                +'</div>';
        }
        else
        {
            return '<div style="white-space: nowrap;">'
                    +'<span style="font-weight: bold; color: #000099;">'
                        +d.day
                    +'</span>'
                    +img
                +'</div>';
        }
    },
    
    _GetMonthForDate: function(d,options){
        var opt=_.defaults((options||{}),{
            showYear: true,
            showMonthNumber: false
        });
        
        var s=state.Calendar.setting;
        var daysHeader='';
        _.each(s.daysOfTheWeek,function(d){
            daysHeader+='<th><div style="width: 25px;margin: 0px auto;">'+d.substring(0,2)+'</div></th>';
        });
        
        var mday=_.clone(d);
        var weeks='';
        mday.day=1;
        _.each(s.weeksOfTheMonth,function(w){
            weeks+='<tr>';
            _.each(s.daysOfTheWeek,function(d){
                weeks+='<td style="vertical-align: middle; text-align:right;">';
                weeks+=Calendar._GetDayForDate(mday,opt);
                weeks+='</td>';
                mday.day++;
            });
            weeks+='</tr>';
        });
        
        return '<table style="border:1px solid black;background-color:#eeffee;">'
        +'<tr><th colspan="'+s.daysOfTheWeek.length+'">'
            +((opt.showMonthNumber)?('<div style="float:right; padding: 0px 3px;">'+d.month+'</div>'):(''))
            +s.monthsOfTheYear[d.month-1]
            +((opt.showYear)?(' '+d.year):(''))
        +'</th></tr>'
        +'<tr style="border-bottom: 1px solid #aaaaaa;">'+daysHeader+'</tr>'
        +weeks
        +'</table>';
    },
    
    _GetYearForDate: function(d,options){
        var opt=_.defaults((options||{}),{
            showLunarPhases: false,
            showYear: false,
            showMonthNumber: true
        });
        var s=state.Calendar.setting;
        var yday=_.clone(d);
        yday.day=1;
        yday.month=1;
        var months='';
        _.each([1,2,3,4],function(r){
            _.each([1,2,3],function(c){
                months+='<div style="float:left;padding: 2px 2px;">';
                months+=Calendar._GetMonthForDate(yday,opt);
                months+='</div>';
                yday.month++;
            });
        });
        
        return '<div style="background-color: #DEB887; border: 3px solid #8B4513; padding: 3px 3px;">'
        +'<div style="border-bottom: 2px solid #8B0000;margin: 3px 3px;font-weight: bold; font-size: 130%; text-align: center;">'+s.yearPrefix+d.year+'</div>'
        +months
        +'<div style="clear:both;"></div></div>';
    },
    
    _GetDateAsString: function(date){
        var s=state.Calendar.setting;
        return s.monthsOfTheYear[date.month-1]+' '+date.day+Calendar._Ordinal(date.day)+', '+s.yearPrefix +date.year;
    },
    
    ShowDate: function(d,options) {
        var opt=_.defaults((options||{}),{
            showLunarPhases: true
        });
        sendChat('','/direct '
            +'<div style=\''
                    +'color: white;'
                    +'padding: 5px 5px;'
                    +'background-color: #000033;'
                    +'font-weight: bold;'
                    +'font-family: Baskerville, "Baskerville Old Face", "Goudy Old Style", Garamond, "Times New Roman", serif;'
                    +'border: 3px solid #999999;'
                    +'text-align: center;'
                    +'\'>'
                +Calendar._GetDateAsString(d,opt)
                +' '
                +Calendar._GetPhaseForDate(d,opt)
            +'</div>'
            );
    },
    
    ShowMonth: function(d,options){
        var opt=_.defaults((options||{}),{
        });
        sendChat('','/direct '+Calendar._GetMonthForDate(d,opt));
    },
    
    ShowYear: function(d,options){
        var opt=_.defaults((options||{}),{
            showYear: false
        });
        sendChat('','/direct '+Calendar._GetYearForDate(d,opt));
    },
    
    playerGM: 0,
    senderID: '',
    
    calcDateIndex: function (day,month,year) {
        return ((year*336) + ((month-1)*28) + day);
    },
    
    calcIndexToDate: function (index) {
        var year = Math.floor(index / 336)
        var month = Math.floor((index % 336) / 28) + 1
        var day = Math.floor((index % 336) % 28)
        var dateArray = [day,month,year]
        return dateArray;
    },
    
    spliceEventIn: function (location,name,index,gm){
                var allEvents = state.Calendar.events
                allEvents.splice(location,0,[name,index,gm]);
                state.Calendar.events = allEvents
    },
    
    addCalendarEvent: function (name,day,month,year,gm) {
            var firstEvent = state.Calendar.events[0]
            var endEvents = state.Calendar.events.length - 1
            var lastEvent = state.Calendar.events[endEvents]
            var newEventIndex = Calendar.calcDateIndex (day,month,year)
            if (state.Calendar.events[0]) {
                if (newEventIndex < firstEvent[1]) {
                    Calendar.spliceEventIn (0,name,newEventIndex,gm);
                    return;
                } else if (newEventIndex > lastEvent[1]) {
                    Calendar.spliceEventIn (state.Calendar.events.length,name,newEventIndex,gm);
                    return;
                } else {
                    for (var i = 0; i < state.Calendar.events.length; i++) {
                        var thisEvent = state.Calendar.events[i]
                        var thisEventIndex = thisEvent[1]
                        if (newEventIndex <= thisEventIndex) {
                            Calendar.spliceEventIn (i,name,newEventIndex,gm);
                            return;
                        };
                    };
                }; 
            } else {
              Calendar.spliceEventIn (0,name,newEventIndex,gm);
              return;
            };
    },
    
    removeCalendarEvent: function (name) {
        if (state.Calendar.events[0]) {
            for (var i = 0; i < state.Calendar.events.length; i++) {
                var thisEvent = state.Calendar.events[i]
                if (name.toUpperCase() == thisEvent[0].toUpperCase()) {
                    state.Calendar.events.splice(i,1)
                };
            };
        };
    },
    
    getEvents: function (direction,limit) {
        var currentIndex = Calendar.calcDateIndex (state.Calendar.now.day,state.Calendar.now.month,state.Calendar.now.year)
        var findEdgeIndex = function (direction,limit,start) {
            if (direction == -1) {
                return start - limit;
            } else if (direction == 1) {
                return start + limit;
            };
        };
        
        var allRecordedEvents = []
        
        var returnEvents = function (start,end) {
            for (var i = 0; i < state.Calendar.events.length; i++) {
                thisEvent = state.Calendar.events[i]
                thisEventIndex = thisEvent[1]
                if (thisEventIndex >= start && thisEventIndex <= end ) {
                    allRecordedEvents.splice(state.Calendar.events.length,0,thisEvent)
                }
            };
        };
        
        var removeGMEvents = function (array) {
            var events = array
            for (var i = 0; i < array.length; i++) {
                thisEvent = events[i]
                if (thisEvent[2] === null){
                    
                } else {
                    if (thisEvent[2].toUpperCase() == "GM") {
                    events.splice(i,1);
                };
            };
            };
            return events;
        };
        
        if (direction == 0) {
            returnEvents (currentIndex,currentIndex);
        } else if (limit) {
            if (direction == -1) {
                returnEvents (currentIndex - limit, currentIndex);
            } else {
                returnEvents (currentIndex, currentIndex + limit);
            };
        } else {
            if (direction == -1) {
                returnEvents (0,currentIndex);
            } else {
                var eventsLength = state.Calendar.events.length
                var lastEvent = state.Calendar.events[eventsLength - 1]
                returnEvents (currentIndex, lastEvent[1]);
            };
        };
        
        if (playerGM == false) {
            allRecordedEvents = removeGMEvents (allRecordedEvents)
        } else {
            //DO NOTHING
        }
        return allRecordedEvents
    },
    
    convertDateArrayToObject: function (array) {
    var newDateObject = {}
    newDateObject.day = array[0]
    newDateObject.month = array[1]
    newDateObject.year = array[2]
    return newDateObject;
    },
        
    buildEventTable: function (direction,title,limit) {
        var targetEvents = Calendar.getEvents (direction,limit);
        if (targetEvents[0]) {
            var eventTable = "&{template:default} {{name=" + title + "}}"
            for (var i = 0; i < targetEvents.length; i++){
                var thisEvent = targetEvents[i]
                var thisEventIndex = thisEvent[1]
                var dateArray = Calendar.calcIndexToDate (thisEventIndex)
                var thisEventString = Calendar._GetDateAsString (Calendar.convertDateArrayToObject (dateArray));
                var newTableEntry = "{{" + thisEvent[0] + "=" + thisEventString + "}}"
                eventTable = eventTable + newTableEntry
            };
            return eventTable;
        } else {
            return "NO EVENTS FOUND FOR SPECIFIED RANGE";
        }
    },
        
    HandleInput: function(tokens){ 
        var options = Calendar._GetOptionsFromTokens(tokens);        
        tokens=_.filter(tokens, function(tok){
            return null == tok.match(/^--/);
        });
        var cmd = tokens[0] || 'month';
        
        var concatenateEventName = function (start) {
            var fullEventName = ''
            var lastWord = tokens.length-1
            for (var i = start; i < tokens.length - 1; i++) {
                var newNamePortion = tokens[i] + " "
                fullEventName = fullEventName
                fullEventName = fullEventName + newNamePortion
            };
            fullEventName = fullEventName + tokens[lastWord]
            return fullEventName;
        };
        
        var sendMsg = function (message) {
            sendChat ("CalendarEvents", "/w " + senderID + " " + message)  
        };
        
        var eventsToday = function () {
            var events = Calendar.buildEventTable (0,"Today's Events")
            if (events === "NO EVENTS FOUND FOR SPECIFIED RANGE") {
                return "No Events Today";
            } else {
            return events;
            }
        };
        
        var returnEventRange = function (direction, title) {
            if (tokens[2]) {
                    var eventsMessage = Calendar.buildEventTable(direction, title + " (" + tokens[2] + " days)",parseInt(tokens[2]))
                    return eventsMessage;
                } else {
                    var eventsMessage = Calendar.buildEventTable(direction,"All " +title)
                    return eventsMessage;
                }
        };
        
        switch (cmd)
        {
            case 'month': 
                Calendar.ShowMonth(state.Calendar.now,options);
                break;
            
            case 'year':
                Calendar.ShowYear(state.Calendar.now,options);
                break;
                
            case 'today':
                Calendar.ShowDate(state.Calendar.now,options);
                playerGM = 0
                var eventsMessage = eventsToday ()
                sendChat ('', eventsMessage)
                playerGM = 1
                var gmEventsMessage = eventsToday ()
                if (eventsMessage != gmEventsMessage) {
                    sendChat ('', "/w gm " + gmEventsMessage)
                };
                break;
                
            case 'next':
                var days=tokens[1] || 1;
                Calendar.AdvanceDays(days);
                Calendar.ShowDate(state.Calendar.now,options);
                playerGM = 0
                var eventsMessage = eventsToday ()
                sendChat ('', eventsMessage)
                playerGM = 1
                var gmEventsMessage = eventsToday ()
                if (eventsMessage != gmEventsMessage) {
                    sendChat ('', "/w gm " + gmEventsMessage)
                };
                break;
            
            case 'prev':
                var days=tokens[1] || 1;
                Calendar.RemoveDays(days);
                Calendar.ShowDate(state.Calendar.now,options);
                playerGM = 0
                var eventsMessage = eventsToday ()
                sendChat ('', eventsMessage)
                playerGM = 1
                var gmEventsMessage = eventsToday ()
                if (eventsMessage != gmEventsMessage) {
                    sendChat ('', "/w gm " + gmEventsMessage)
                }
                break;
                
            case 'AddEvent':
                if (tokens[1].toUpperCase() === "TODAY" ) {
                    if (tokens[2].toUpperCase() === "GM") {
                        Calendar.addCalendarEvent (concatenateEventName(3),state.Calendar.now.day,state.Calendar.now.month,state.Calendar.now.year,"GM");
                        sendMsg ("Your GM event has been added TODAY");
                    } else {
                        Calendar.addCalendarEvent (concatenateEventName(3),state.Calendar.now.day,state.Calendar.now.month,state.Calendar.now.year);
                        sendMsg ("Your PUBLIC event has been added TODAY");
                    };   
                } else if (isNaN(parseInt(tokens[1])) === false && isNaN(parseInt(tokens[2])) === false && isNaN(parseInt(tokens[3])) === false) {
                    if (tokens[4].toUpperCase() === "GM" ) {
                        Calendar.addCalendarEvent (concatenateEventName(4),parseInt(tokens[1]),parseInt(tokens[2]),parseInt(tokens[3]),"GM");
                        sendMsg ("Your GM event has been added at the SPECIFIED DATE")
                    } else {
                        Calendar.addCalendarEvent (concatenateEventName(4),parseInt(tokens[1]),parseInt(tokens[2]),parseInt(tokens[3]));
                        sendMsg ("Your PUBLIC event has been added at the SPECIFIED DATE")
                    };
                };
                break;
            
            case 'RemoveEvent':
                targetName = concatenateEventName(1)
                Calendar.removeCalendarEvent (targetName);
                sendMsg ("You have removed the event named -- " + targetName)
                break;
                
            case 'GetEvents':
                var targetFrame = tokens[1].toUpperCase()
                if (targetFrame === "PAST" ) {
                    sendChat ("CalendarEvents","/w " + senderID + returnEventRange (-1,"Past Events"));
                } else if (targetFrame === "PRESENT") {
                    var eventsMessage = eventsToday ()
                    sendChat ("CalendarEvents","/w " + senderID + eventsMessage);
                } else if (targetFrame === "FUTURE") {
                    sendChat ("CalendarEvents","/w " + senderID + returnEventRange (1,"Upcoming Events"));
                };
                break;
            
            case 'DisplayEvents':
                playerGM = 0
                var targetFrame = tokens[1].toUpperCase()
                if (targetFrame === "PAST" ) {
                    sendChat ("CalendarEvents", returnEventRange (-1,"Past Events"));
                } else if (targetFrame === "PRESENT") {
                    var eventsMessage = eventsToday ()
                    sendChat ("CalendarEvents", eventsMessage);
                } else if (targetFrame === "FUTURE") {
                    sendChat ("CalendarEvents", returnEventRange (1,"Upcoming Events"));
                };
                break;
        }
        
    },
    
    RegisterEventHandlers: function() {
        on("chat:message", function (msg) {
            /* Exit if not an api command */
            if (msg.type != "api") return;
            
            /* clean up message bits. */
            msg.who = msg.who.replace(" (GM)", "");
            msg.content = msg.content.replace("(GM) ", "");

            var tokenized = msg.content.split(" ");
            var command = tokenized[0];
            var sendingPlayerID = msg.playerid
            senderID = msg.who
            playerGM = playerIsGM(sendingPlayerID);

            switch(command)
            {
                case "!cal":
                case "!calendar":
                {
                    Calendar.HandleInput(_.rest(tokenized));
                }
                break;
                
                case "!s":
                {
                    sendChat('',
                        '/direct <div style="border: 2px solid red;"><b>state.Calendar</b><br><pre>'
                        +JSON.stringify(state.Calendar,undefined,"   ").replace(/\n/g,'<br>')
                        +"</pre></div>" );
                }
                break;
            }
        });
    }  
};

on("ready",function(){
    Calendar.CheckInstall(); 
    Calendar.RegisterEventHandlers();
});