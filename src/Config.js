/**********
 * Config *
 **********/

/********
 * Section: Functions related to saving, loading and restoring configs */

/**
 * This function saves the config of CookieMonster to localStorage
 * It is called by CM.LoadConfig(), CM.RestoreDefault(), 
 * any of the CM.ToggleConfig() functions and upon changes to URL or volume settings
 * @param 	{object}	config	The Config to be saved (normally CM.Config)
 */
CM.SaveConfig = function(config) {
	localStorage.setItem(CM.ConfigPrefix, JSON.stringify(config));
}

/**
 * This function loads the config of CookieMonster saved in localStorage and loads it into CM.Config
 * It is called by CM.DelayInit() and CM.RestoreDefault()
 */
CM.LoadConfig = function() {
	if (localStorage.getItem(CM.ConfigPrefix) != null) {
		CM.Config = JSON.parse(localStorage.getItem(CM.ConfigPrefix));

		// Check values
		var mod = false;
		for (var i in CM.Data.ConfigDefault) {
			if (typeof CM.Config[i] === 'undefined') {
				mod = true;
				CM.Config[i] = CM.Data.ConfigDefault[i];
			}
			else if (i != 'StatsPref' && i != 'Colors') {
				if (i.indexOf('SoundURL') == -1) {
					if (!(CM.Config[i] > -1 && CM.Config[i] < CM.ConfigData[i].label.length)) {
						mod = true;
						CM.Config[i] = CM.Data.ConfigDefault[i];
					}
				}
				else {  // Sound URLs
					if (typeof CM.Config[i] != 'string') {
						mod = true;
						CM.Config[i] = CM.Data.ConfigDefault[i];
					}
				}
			}
			else if (i == 'StatsPref') {
				for (var j in CM.Data.ConfigDefault.StatsPref) {
					if (typeof CM.Config[i][j] === 'undefined' || !(CM.Config[i][j] > -1 && CM.Config[i][j] < 2)) {
						mod = true;
						CM.Config[i][j] = CM.Data.ConfigDefault[i][j];
					}
				}
			}
			else { // Colors
				for (var j in CM.Data.ConfigDefault.Colors) {
					if (typeof CM.Config[i][j] === 'undefined' || typeof CM.Config[i][j] != 'string') {
						mod = true;
						CM.Config[i][j] = CM.Data.ConfigDefault[i][j];
					}
				}
			}
		}
		if (mod) CM.SaveConfig(CM.Config);
		CM.Loop(); // Do loop once
		for (var i in CM.Data.ConfigDefault) {
			if (i != 'StatsPref' && i != 'OptionsPref' && typeof CM.ConfigData[i].func !== 'undefined') {
				CM.ConfigData[i].func();
			}
		}
	}
	else { // Default values
		CM.RestoreDefault();
	}
}

/**
 * This function reloads and resaves the default config as stored in CM.Data.ConfigDefault
 * It is called by resDefBut.onclick loaded in the options page or by CM.LoadConfig is no localStorage is found
 */
CM.RestoreDefault = function() {
	CM.Config = {};
	CM.SaveConfig(CM.Data.ConfigDefault);
	CM.LoadConfig();
	Game.UpdateMenu();
}

/********
 * Section: Functions related to toggling or changing configs */

/**
 * This function toggles options which are considered "toggles"
 * These have off (1) and on (1) states
 * It is called by the onclick event of options of the "bool" type
 * @param 	{string}	config	The name of the option
 */
CM.ToggleConfig = function(config) {
	CM.ToggleConfigUp(config);
	if (CM.ConfigData[config].toggle) {
		if (CM.Config[config] == 0) {
			l(CM.ConfigPrefix + config).className = 'option off';
		}
		else {
			l(CM.ConfigPrefix + config).className = 'option';
		}
	}
}

CM.ToggleConfigUp = function(config) {
	CM.Config[config]++;
	if (CM.Config[config] == CM.ConfigData[config].label.length) {
		CM.Config[config] = 0;
	}
	if (typeof CM.ConfigData[config].func !== 'undefined') {
		CM.ConfigData[config].func();
	}
	l(CM.ConfigPrefix + config).innerHTML = CM.ConfigData[config].label[CM.Config[config]];
	CM.SaveConfig(CM.Config);
}

/**
 * This function sets the value of the specified volume-option and updates the display in the options menu
 * It is called by CM.Disp.CreatePrefOption()
 * @param 	{string}	config	The name of the option
 */
CM.ToggleConfigVolume = function(config) {
	if (l("slider" + config) != null) {
		l("slider" + config + "right").innerHTML = l("slider" + config).value + "%";
		CM.Config[config] = Math.round(l("slider" + config).value);
	} 
	CM.SaveConfig(CM.Config);
}

CM.ToggleStatsConfig = function(config) {
	if (CM.Config.StatsPref[config] == 0) {
		CM.Config.StatsPref[config]++;
	}
	else {
		CM.Config.StatsPref[config]--;
	}
	CM.SaveConfig(CM.Config);
}

CM.ToggleOptionsConfig = function(config) {
	if (CM.Config.OptionsPref[config] == 0) {
		CM.Config.OptionsPref[config]++;
	}
	else {
		CM.Config.OptionsPref[config]--;
	}
	CM.SaveConfig(CM.Config);
}

// Checks if the browsers has permissions to produce notifications
// Should be triggered when Config related to Notifications is toggled on
CM.CheckNotificationPermissions = function(ToggleOnOff) {
	if (ToggleOnOff == 1)	{
		// Check if browser support Promise version of Notification Permissions
		function checkNotificationPromise() {
			try {
				Notification.requestPermission().then();
			} catch(e) {
				return false;
			}
			return true;
		}

		// Check if the browser supports notifications and which type
		if (!('Notification' in window)) {
			console.log("This browser does not support notifications.");
		} 
		else {
			if(checkNotificationPromise()) {
				Notification.requestPermission().then();
			} 
			else {
				Notification.requestPermission();
			}
		}
	}
}