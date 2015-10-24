//Pathfinder Wound Threshold Script -- Last Updated 10/23/15
//Written by Brent T. contact: https://app.roll20.net/users/391008/brent-t
//GitHub: https://github.com/Cephalopd/Roll20ScriptsMASTER/blob/master/
	  on("change:token:bar3_value", function(obj,prev) {
          var maxHealth = parseInt(obj.get("bar3_max"))
          var currentHealth = parseInt(obj.get("bar3_value"))
          var tokenID = obj.get("_id")
          var characterID = obj.get("represents")
          var grazedThreshold = Math.floor(maxHealth * 0.75)
          var woundedThreshold = Math.floor(maxHealth * 0.5)
          var criticalThreshold = Math.floor(maxHealth * 0.25)
          var currentWoundThreshold = function () {
              if (currentHealth > grazedThreshold) {
              return 0;
          } else if (currentHealth <= grazedThreshold && currentHealth > woundedThreshold) {
              return 1;
          } else if (currentHealth <= woundedThreshold && currentHealth > criticalThreshold) {
              return 2;
          } else if (currentHealth <= criticalThreshold && currentHealth > 0) {
              return 3;
          } else if (currentHealth == 0) {
              return -1;
          } else {
              return -2;
          };};
          var setLogic = function (threshold) {
              if (characterID) {
              var character = getObj ('character', characterID)
              var characterName = character.get('name')
              var currentCharacterWoundThresholdAttribute = findObjs({ type: 'attribute', characterid: character.id, name: 'condition-Wounds'   })[0];
              var currentCharacterWoundThresholdValue = currentCharacterWoundThresholdAttribute.get ('current')
              };
          switch (threshold) {
            case 0:
                obj.set ('tint_color', 'transparent');
                if (characterID && currentCharacterWoundThresholdAttribute != threshold) {
                    sendChat ('WoundManager', characterName + ' is now at full capacity')
                    currentCharacterWoundThresholdAttribute.set('current', threshold)
                } else {
                    return;
                }
            break;
            case 1:
                obj.set ('tint_color', '#ffff00');
                if (characterID && currentCharacterWoundThresholdAttribute != threshold) {
                    sendChat ('WoundManager', characterName + ' is now grazed')
                    currentCharacterWoundThresholdAttribute.set('current', threshold)
                } else {
                    return;
                }
            break;
            case 2:
                obj.set ('tint_color', '#ff9900');
                if (characterID && currentCharacterWoundThresholdAttribute != threshold) {
                    sendChat ('WoundManager', characterName + ' is now wounded')
                    currentCharacterWoundThresholdAttribute.set('current', threshold)
                } else {
                    return;
                }
            break;
            case 3:
                obj.set ('tint_color', '#ff0000');
                if (characterID && currentCharacterWoundThresholdAttribute != threshold) {
                    sendChat ('WoundManager', characterName + ' is now critical')
                    currentCharacterWoundThresholdAttribute.set('current', threshold)
                } else {
                    return;
                }
            break;
            case -1:
                obj.set ('tint_color', '#000000');
                if (characterID && currentCharacterWoundThresholdAttribute != threshold) {
                    sendChat ('WoundManager', characterName + ' is unconscious')
                } else {
                    return;
                }
            break;
                        case -2:
                obj.set ('tint_color', '#000000');
                if (characterID && currentCharacterWoundThresholdAttribute != threshold) {
                    sendChat ('WoundManager', characterName + ' is unconscious')
                } else {
                    return;
                }
            break;
          };
          }; 
          setLogic (currentWoundThreshold()); 
  });
      