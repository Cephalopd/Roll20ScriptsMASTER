on("chat:message", function(msg) {
var cmdName;
var msgTxt;
var allNPC = ["Aerys Mavato", "Gelik Aberwhinge", "Ishirou", "Jask Derindi", "Sasha Nevah"]
cmdName = "!saves";
msgTxt = msg.content;
  if(msg.type == "api" && msg.content.indexOf(cmdName) !== -1) {
       var targetName = msgTxt.slice(cmdName.length + 1);
       if (targetName = "All") {}
	   var bob = findObjs({ type: 'character', name: 'Druid' })[0];
       var bobWill = findObjs({ type: 'attribute', characterid: bob.id, name: 'druid_level' })[0];
       var bobWillValue = bobWill.get('current');
       log (targetName)
       var bobMorale = findObjs({ type: 'attribute', characterid: bob.id, name: 'Morale' })[0];
        bobMorale.set('current', bobWillValue);
       sendChat(msg.who, "/w " + msg.who + " must specify two comma-separated token names for !carry command.")
}

});