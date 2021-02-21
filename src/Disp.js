/********
 * Disp *
 ********/

/********
 * Please make sure to annotate your code correctly using JSDoc.
 * Only put functions related to graphics and displays in this file. 
 * All calculations and data should preferrably be put in other files. */

/********
 * Section: Auxilirary functions used by other functions */

/**
 * This function returns the total amount stored in the Wrinkler Bank 
 * as calculated by  CM.Cache.CacheWrinklers() if CM.Options.CalcWrink is set
 * @returns	{number}	0 or the amount of cookies stored (CM.Cache.WrinklersTotal)
 */
CM.Disp.GetWrinkConfigBank = function() {
	if (CM.Options.CalcWrink === 1) {
		return CM.Cache.WrinklersTotal;}
	else if (CM.Options.CalcWrink === 2) {
		return CM.Cache.WrinklersFattest[0];}
	else {
		return 0;}
};

/**
 * This function pops all normal wrinklers 
 * It is called by a click of the 'pop all' button created by CM.Disp.AddMenuStats()
 */
CM.Disp.PopAllNormalWrinklers = function() {
	for (let i of Object.keys(Game.wrinklers)) {
		if (Game.wrinklers[i].sucked > 0 && Game.wrinklers[i].type === 0) {
			Game.wrinklers[i].hp = 0;
		}
	}
};

/**
 * This function returns the cps as either current or average CPS depending on CM.Options.CPSMode
 * @returns	{number}	The average or current cps
 */
CM.Disp.GetCPS = function() {
	if (CM.Options.CPSMode) {
		return CM.Cache.AvgCPS;}
	else {
		if (CM.Options.CalcWrink === 0) {
			return (Game.cookiesPs * (1 - Game.cpsSucked));
		}
		else if (CM.Options.CalcWrink === 1) {
			return Game.cookiesPs * (CM.Cache.CurrWrinklerCPSMult + (1 - (CM.Cache.CurrWrinklerCount * 0.05)));
		}
		else if (CM.Options.CalcWrink === 2) {
			// Check if fattest is shiny
			if (Game.wrinklers[CM.Cache.WrinklersFattest[1]].type === 1) {
				return Game.cookiesPs * ((CM.Cache.CurrWrinklerCPSMult * 3 / CM.Cache.CurrWrinklerCount)  + (1 - (CM.Cache.CurrWrinklerCount * 0.05)));
			}
			else {
				return Game.cookiesPs * ((CM.Cache.CurrWrinklerCPSMult / CM.Cache.CurrWrinklerCount)  + (1 - (CM.Cache.CurrWrinklerCount * 0.05)));
			}
		}
	}
};

/**
 * This function calculates the time it takes to reach a certain magic level
 * It is called by CM.Disp.UpdateTooltipGrimoire()
 * @param	{number}	currentMagic		The current magic level
 * @param	{number}	maxMagic			The user's max magic level
 * @param	{number}	targetMagic			The target magic level
 * @returns	{number}	count / Game.fps	The time it takes to reach targetMagic
 */
CM.Disp.CalculateGrimoireRefillTime = function(currentMagic, maxMagic, targetMagic) {
	let count = 0;
	while (currentMagic < targetMagic) {
		currentMagic += Math.max(0.002, Math.pow(currentMagic / Math.max(maxMagic, 100), 0.5)) * 0.002;
		count++;
	}
	return count / Game.fps;
};

/**
 * This function returns Name and Color as object for sugar lump type that is given as input param.
 * It is called by CM.Disp.UpdateTooltipSugarLump()
 * @param 	{string} 				type 			Sugar Lump Type.
 * @returns {{string}, {string}}	text, color		An array containing the text and display-color of the sugar lump
 */
CM.Disp.GetLumpColor = function(type) {
	if (type === 0) {
		return {text: "Normal", color: CM.Disp.colorGray};
	} else if (type === 1) {
		return {text: "Bifurcated", color: CM.Disp.colorGreen};
	} else if (type === 2) {
		return {text: "Golden", color: CM.Disp.colorYellow};
	} else if (type === 3) {
		return {text: "Meaty", color: CM.Disp.colorOrange};
	} else if (type === 4) {
		return {text: "Caramelized", color: CM.Disp.colorPurple};
	} else {
		return {text: "Unknown Sugar Lump", color: CM.Disp.colorRed};
	} 
};

/********
 * Section: General functions to format or beautify strings */

/**
 * This function returns time as a string depending on TimeFormat setting
 * @param  	{number} 	time		Time to be formatted
 * @param  	{number}	longFormat 	1 or 0
 * @returns	{string}				Formatted time
 */
CM.Disp.FormatTime = function(time, longFormat) {
	if (time === Infinity) return time;
	time = Math.ceil(time);
	let y = Math.floor(time / 31557600);
	let d = Math.floor(time % 31557600 / 86400);
	let h = Math.floor(time % 86400 / 3600);
	let m = Math.floor(time % 3600 / 60);
	let s = Math.floor(time % 60);
	let str = '';
	if (CM.Options.TimeFormat) {
		if (time > 3155760000) return 'XX:XX:XX:XX:XX';
		str += (y < 10 ? '0' : '') + y + ':';
		str += (d < 10 ? '0' : '') + d + ':';
		str += (h < 10 ? '0' : '') + h + ':';
		str += (m < 10 ? '0' : '') + m + ':';
		str += (s < 10 ? '0' : '') + s;
	} else {
		if (time > 777600000) return longFormat ? 'Over 9000 days!' : '>9000d';
		str += (y > 0 ? y + (longFormat ? (y === 1 ? ' year' : ' years') : 'y') + ', ': "");
		str += (d > 0 ? d + (longFormat ? (d === 1 ? ' day' : ' days') : 'd') + ', ': "");
		if (str.length > 0 || h > 0) str += h + (longFormat ? (h === 1 ? ' hour' : ' hours') : 'h') + ', ';
		if (str.length > 0 || m > 0) str += m + (longFormat ? (m === 1 ? ' minute' : ' minutes') : 'm') + ', ';
		str += s + (longFormat ? (s === 1 ? ' second' : ' seconds') : 's');
	}
	return str;
};

/**
 * This function returns the color to be used for time-strings
 * @param	{number}			time			Time to be coloured
 * @returns {{string, string}}	{text, color}	Both the formatted time and color as strings in an array
 */
CM.Disp.GetTimeColor = function(time) {
	let color;
	let text;
	if (time < 0) {
		if (CM.Options.TimeFormat) text = '00:00:00:00:00';
		else text = 'Done!';
		color = CM.Disp.colorGreen;
	} 
	else {
		text = CM.Disp.FormatTime(time);
		if (time > 300) color =  CM.Disp.colorRed;
		else if (time > 60) color =  CM.Disp.colorOrange;
		else color =  CM.Disp.colorYellow;
	}
	return {text: text, color: color};
};

/**
 * This function returns formats number based on the Scale setting
 * @param	{number}	num		Number to be beautified
 * @param 	{any}		floats 	Used in some scenario's by CM.Backup.Beautify (Game's original function)
 * @param	{number}	forced	Used to force (type 3) in certains cases
 * @returns	{string}			Formatted number
 */
CM.Disp.Beautify = function(num, floats, forced) {
	let decimals = CM.Options.ScaleDecimals + 1;
	if (CM.Options.Scale === 0) {
		return CM.Backup.Beautify(num, floats);
	}
	else if (isFinite(num)) {
		let answer = '';
		if (num === 0) {
			return num.toString();
		}
		else if (0.001 < num && num < CM.Options.ScaleCutoff) {
			answer = num.toFixed(2);
			if (CM.Options.ScaleSeparator) answer = answer.toLocaleString('nl');
			for (let i = 0; i < 3; i++) {
				if (answer[answer.length - 1] === "0" || answer[answer.length - 1] === ".") answer = answer.slice(0, -1);
			}
			return answer;
		}
		else if (CM.Options.Scale === 4 && !forced || forced === 4) { // Scientific notation, 123456789 => 1.235E+8
			answer = num.toExponential(decimals).toString().replace("e", "E"); 
		}
		else {
			let exponential = num.toExponential().toString();
			let AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf("e") + 1) / 3);
			answer = (num / Number("1e" + (AmountOfTenPowerThree * 3))).toFixed(decimals);
			// answer is now "xxx.xx" (e.g., 123456789 would be 123.46)
			if (CM.Options.Scale === 1 && !forced || forced === 1) { // Metric scale, 123456789 => 123.457 M
				if (num >= 0.01 && num < Number("1e" + CM.Data.metric.length * 3)) {
					answer += ' ' + CM.Data.metric[AmountOfTenPowerThree];
				}
				// If number is too large or little, revert to scientific notation
				else answer = CM.Disp.Beautify(num, 0, 4);
			}
			else if (CM.Options.Scale === 2 && !forced || forced === 2) { // Short scale, 123456789 => 123.457 M
				if (num >= 0.01 && num < Number("1e" + CM.Data.shortScale.length * 3)) {
					answer += ' ' + CM.Data.shortScale[AmountOfTenPowerThree];
				}
				// If number is too large or little, revert to scientific notation
				else answer = CM.Disp.Beautify(num, 0, 4);
			}
			else if (CM.Options.Scale === 3 && !forced || forced === 3) { // Short scale, 123456789 => 123.457 M
				if (num >= 0.01 && num < Number("1e" + CM.Data.shortScaleAbbreviated.length * 3)) {
					answer += ' ' + CM.Data.shortScaleAbbreviated[AmountOfTenPowerThree];
				}
				// If number is too large or little, revert to scientific notation
				else answer = CM.Disp.Beautify(num, 0, 4);
			}
			else if (CM.Options.Scale === 5 && !forced || forced === 5) { // Engineering notation, 123456789 => 123.457E+6
				answer += 'E' + AmountOfTenPowerThree * 3;
			}
		}
		if (answer === '') {
			console.log("Could not beautify number with CM.Disp.Beautify: " + num);
			answer = CM.Backup.Beautify(num, floats); 
		}
		if (CM.Options.ScaleSeparator) answer = answer.replace('.', ',');
		return answer;
	}
	else if (num === Infinity) {
		return "Infinity";
	}
	else if (typeof num === "undefined") {
		return 0;
	}
	else {
		console.log("Could not beautify number with CM.Disp.Beautify: " + num);
		return CM.Backup.Beautify(num, floats);
	}
};

/********
 * Section: General functions related to display, drawing and initialization of the page */

/**
 * This function disables and shows the bars created by CookieMonster when the game is "ascending"
 * It is called by CM.Disp.Draw()
 */
CM.Disp.UpdateAscendState = function() {
	if (Game.OnAscend) {
		l('game').style.bottom = '0px';
		if (CM.Options.BotBar === 1) CM.Disp.BotBar.style.display = 'none';
		if (CM.Options.TimerBar === 1) CM.Disp.TimerBar.style.display = 'none';
	}
	else {
		CM.Disp.ToggleBotBar();
		CM.Disp.ToggleTimerBar();
	}
	CM.Disp.UpdateBackground();
};

/**
 * This function creates a CSS style that stores certain standard CSS classes used by CookieMonster
 * It is called by CM.Main.DelayInit()
 */
CM.Disp.CreateCssArea = function() {
	CM.Disp.Css = document.createElement('style');
	CM.Disp.Css.type = 'text/css';

	document.head.appendChild(CM.Disp.Css);
};

/**
 * This function updates the style of the building and upgrade sections to make these sortable
 * It is called by CM.Main.DelayInit()
 */
CM.Disp.UpdateBuildingUpgradeStyle = function() {
	l("products").style.display = "grid";
	l("storeBulk").style.gridRow = "1/1";

	l("upgrades").style.display = "flex";
	l("upgrades").style["flex-wrap"] = "wrap";
};

/**
 * This function sets the size of the background of the full game and the left column
 * depending on whether certain abrs are activated
 * It is called by CM.Disp.UpdateAscendState() and CM.Disp.UpdateBotTimerBarPosition()
 */
CM.Disp.UpdateBackground = function() {
	Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
	Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
	Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
	Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
};

/**
 * This function handles all custom drawing for the Game.Draw() function.
 * It is hooked on 'draw' by CM.RegisterHooks()
 */
CM.Disp.Draw = function () {
	// Draw autosave timer in stats menu, this must be done here to make it count down correctly
	if (
		(Game.prefs.autosave && Game.drawT % 10 === 0) && // with autosave ON and every 10 ticks
		(Game.onMenu === 'stats' && CM.Options.Stats) // while being on the stats menu only
	) {
		let timer = document.getElementById('CMStatsAutosaveTimer');
		if (timer) {
			timer.innerText = Game.sayTime(Game.fps * 60 - (Game.T % (Game.fps * 60)), 4);
		}
	}

	// Update colors
	CM.Disp.UpdateBuildings();
	CM.Disp.UpdateUpgrades();

	// Redraw timers
	CM.Disp.UpdateTimerBar();

	// Update Bottom Bar
	CM.Disp.UpdateBotBar();

	// Update Tooltip
	CM.Disp.UpdateTooltip();

	// Update Wrinkler Tooltip
	CM.Disp.CheckWrinklerTooltip();
	CM.Disp.UpdateWrinklerTooltip();

	// Change menu refresh interval
	CM.Disp.RefreshMenu();
};

/********
 * Section: Functions related to the Bottom Bar */

/**
 * This function toggle the bottom bar
 * It is called by CM.Disp.UpdateAscendState() and a change in CM.Options.BotBar
 */
CM.Disp.ToggleBotBar = function() {
	if (CM.Options.BotBar === 1) {
		CM.Disp.BotBar.style.display = '';
		if (!CM.Footer.isInitzializing) {
			CM.Disp.UpdateBotBar();
		}
	}
	else {
		CM.Disp.BotBar.style.display = 'none';
	}
	CM.Disp.UpdateBotTimerBarPosition();
};

/**
 * This function creates the bottom bar and appends it to l('wrapper')
 * It is called by CM.Main.DelayInit and a change in CM.Options.BotBar
 */
CM.Disp.CreateBotBar = function() {
	CM.Disp.BotBar = document.createElement('div');
	CM.Disp.BotBar.id = 'CMBotBar';
	CM.Disp.BotBar.style.height = '69px';
	CM.Disp.BotBar.style.width = '100%';
	CM.Disp.BotBar.style.position = 'absolute';
	CM.Disp.BotBar.style.display = 'none';
	CM.Disp.BotBar.style.backgroundColor = '#262224';
	CM.Disp.BotBar.style.backgroundImage = 'linear-gradient(to bottom, #4d4548, #000000)';
	CM.Disp.BotBar.style.borderTop = '1px solid black';
	CM.Disp.BotBar.style.overflow = 'auto';
	CM.Disp.BotBar.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';

	let table = CM.Disp.BotBar.appendChild(document.createElement('table'));
	table.style.width = '100%';
	table.style.textAlign = 'center';
	table.style.whiteSpace = 'nowrap';
	let tbody = table.appendChild(document.createElement('tbody'));

	let firstCol = function(text, color) {
		let td = document.createElement('td');
		td.style.textAlign = 'right';
		td.className = CM.Disp.colorTextPre + color;
		td.textContent = text;
		return td;
	};
	let type = tbody.appendChild(document.createElement('tr'));
	type.style.fontWeight = 'bold';
	type.appendChild(firstCol('CM ' + CM.VersionMajor + '.' + CM.VersionMinor, CM.Disp.colorYellow));
	let bonus = tbody.appendChild(document.createElement('tr'));
	bonus.appendChild(firstCol('Bonus Income', CM.Disp.colorBlue));
	let pp = tbody.appendChild(document.createElement('tr'));
	pp.appendChild(firstCol('Payback Period', CM.Disp.colorBlue));
	let time = tbody.appendChild(document.createElement('tr'));
	time.appendChild(firstCol('Time Left', CM.Disp.colorBlue));

	for (let i of Object.keys(Game.Objects)) {
		CM.Disp.CreateBotBarBuildingColumn(i);
	}

	l('wrapper').appendChild(CM.Disp.BotBar);
};

/**
 * This function updates the bonus-, pp-, and time-rows in the the bottom bar
 * It is called by CM.Disp.Draw()
 */
CM.Disp.UpdateBotBar = function() {
	if (CM.Options.BotBar === 1 && CM.Cache.Objects1) {
		let count = 0;
		for (let i of Object.keys(CM.Cache.Objects1)) {
			let target = `Objects${Game.buyBulk}`
			count++;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[0].childNodes[count].childNodes[1].textContent = Game.Objects[i].amount;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[1].childNodes[count].textContent = Beautify(CM.Cache[target][i].bonus, 2);
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].className = CM.Disp.colorTextPre + CM.Cache[target][i].color;
			CM.Disp.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(CM.Cache[target][i].pp, 2);
			let timeColor = CM.Disp.GetTimeColor((Game.Objects[i].bulkPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
			CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].className = CM.Disp.colorTextPre + timeColor.color;
			if (timeColor.text === "Done!" && Game.cookies < Game.Objects[i].bulkPrice) {
				CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text + " (with Wrink)";
			}
			else CM.Disp.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text;
		}
	}
};

/**
 * This function extends the bottom bar (created by CM.Disp.CreateBotBar) with a column for the given building.
 * This function is called by CM.Disp.CreateBotBar on initialization of Cookie Monster,
 * and also in CM.Sim.CopyData if a new building (added by another mod) is discovered.
 * @param	{string}	buildingName	Objectname to be added (e.g., "Cursor")
 */
CM.Disp.CreateBotBarBuildingColumn = function(buildingName) {
	if(!CM.Disp.BotBar) {
		CM.Disp.CreateBotBar();
		return; // CreateBotBar will call this function again
	}

	let type  = CM.Disp.BotBar.firstChild.firstChild.childNodes[0];
	let bonus = CM.Disp.BotBar.firstChild.firstChild.childNodes[1];
	let pp    = CM.Disp.BotBar.firstChild.firstChild.childNodes[2];
	let time  = CM.Disp.BotBar.firstChild.firstChild.childNodes[3];

	let i = buildingName;
	let header = type.appendChild(document.createElement('td'));
	header.appendChild(document.createTextNode((i.indexOf(' ') != -1 ? i.substring(0, i.indexOf(' ')) : i) + ' ('));

	let span = header.appendChild(document.createElement('span'));
	span.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;

	header.appendChild(document.createTextNode(')'));
	bonus.appendChild(document.createElement('td'));
	pp.appendChild(document.createElement('td'));
	time.appendChild(document.createElement('td'));
};

/********
 * Section: Functions related to the Timer Bar 

/**
 * This function creates the TimerBar and appends it to l('wrapper')
 * It is called by CM.Main.DelayInit()
 */
CM.Disp.CreateTimerBar = function() {
	CM.Disp.TimerBar = document.createElement('div');
	CM.Disp.TimerBar.id = 'CMTimerBar';
	CM.Disp.TimerBar.style.position = 'absolute';
	CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.TimerBar.style.height = '30px';
	CM.Disp.TimerBar.style.fontSize = '10px';
	CM.Disp.TimerBar.style.fontWeight = 'bold';
	CM.Disp.TimerBar.style.backgroundColor = 'black';

	CM.Disp.TimerBars = {};
	CM.Disp.BuffTimerBars = {};

	// Create standard Golden Cookie bar
	CM.Disp.TimerBars.CMTimerBarGC = CM.Disp.TimerBarCreateBar('CMTimerBarGC', 
		'Next Cookie', 
		[{id: 'CMTimerBarGCMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarGCBar', color: CM.Disp.colorPurple}]
		);
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBars.CMTimerBarGC);

	// Create standard Reindeer bar
	CM.Disp.TimerBars. CMTimerBarRen = CM.Disp.TimerBarCreateBar('CMTimerBarRen', 
		'Next Reindeer', 
		[{id: 'CMTimerBarRenMinBar', color: CM.Disp.colorGray}, {id: 'CMTimerBarRenBar', color: CM.Disp.colorOrange}]
		);
	CM.Disp.TimerBar.appendChild(CM.Disp.TimerBars. CMTimerBarRen);

	l('wrapper').appendChild(CM.Disp.TimerBar);
};

/**
 * This function creates an indivudual timer for the timer bar
 * It is called by CM.Main.DelayInit()
 * @param	{string}					id					An id to identify the timer
 * @param	{string}					name				The title of the timer
 * @param	[{{string}, {string}}, ...]	bars ([id, color])	The id and colours of individual parts of the timer
 */
CM.Disp.TimerBarCreateBar = function(id, name, bars) {
	let timerBar = document.createElement('div');
	timerBar.id = 'CMTimerBar';
	timerBar.style.height = '12px';
	timerBar.style.margin = '0px 10px';
	timerBar.style.position = 'relative';

	let div = document.createElement('div');
	div.style.width = '100%';
	div.style.height = '10px';
	div.style.margin = 'auto';
	div.style.position = 'absolute';
	div.style.left = '0px';
	div.style.top = '0px';
	div.style.right = '0px';
	div.style.bottom = '0px';

	let type = document.createElement('span');
	type.style.display = 'inline-block';
	type.style.textAlign = 'right';
	type.style.fontSize = "10px";
	type.style.width = '108px';
	type.style.marginRight = '5px';
	type.style.verticalAlign = 'text-top';
	type.textContent = name;
	div.appendChild(type);

	for (let i = 0; i < bars.length; i++) {
		let colorBar = document.createElement('span');
		colorBar.id = bars[i].id;
		colorBar.style.display = 'inline-block';
		colorBar.style.height = '10px';
		colorBar.style.verticalAlign = "text-top";
		colorBar.style.textAlign="center";
		if (bars.length - 1 === i) {
			colorBar.style.borderTopRightRadius = '10px';
			colorBar.style.borderBottomRightRadius = '10px';
		}
		if (typeof bars[i].color !== 'undefined') {
			colorBar.className = CM.Disp.colorBackPre + bars[i].color;
		}
		div.appendChild(colorBar);
	}

	let timer = document.createElement('span');
	timer.id = id + 'Time';
	timer.style.marginLeft = '5px';
	timer.style.verticalAlign = 'text-top';
	div.appendChild(timer);
	
	timerBar.appendChild(div);

	return timerBar;
};

/**
 * This function updates indivudual timers in the timer bar
 * It is called by CM.Disp.Draw()
 */
CM.Disp.UpdateTimerBar = function() {
	if (CM.Options.TimerBar === 1) {
		// label width: 113, timer width: 30, div margin: 20
		let maxWidthTwoBar = CM.Disp.TimerBar.offsetWidth - 163;
		// label width: 113, div margin: 20, calculate timer width at runtime
		let maxWidthOneBar = CM.Disp.TimerBar.offsetWidth - 133;
		let numberOfTimers = 0;

		// Regulates visibility of Golden Cookie timer
		if (Game.shimmerTypes.golden.spawned === 0 && !Game.Has('Golden switch [off]')) {
			CM.Disp.TimerBars.CMTimerBarGC.style.display = '';
			l('CMTimerBarGCMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes.golden.minTime - Game.shimmerTypes.golden.time) * maxWidthTwoBar / Game.shimmerTypes.golden.maxTime) + 'px';
			if (CM.Options.TimerBarOverlay >=  1) l('CMTimerBarGCMinBar').textContent = Math.ceil((Game.shimmerTypes.golden.minTime - Game.shimmerTypes.golden.time)/ Game.fps);
			else l('CMTimerBarGCMinBar').textContent = "";
			if (Game.shimmerTypes.golden.minTime === Game.shimmerTypes.golden.maxTime) {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '10px';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '10px';
			}
			else {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '';
			}
			l('CMTimerBarGCBar').style.width = Math.round(Math.min(Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.minTime, Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) * maxWidthTwoBar / Game.shimmerTypes.golden.maxTime) + 'px';
			if (CM.Options.TimerBarOverlay >=  1) l('CMTimerBarGCBar').textContent = Math.ceil(Math.min(Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.minTime, Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) / Game.fps);
			else l('CMTimerBarGCBar').textContent = "";
			l('CMTimerBarGCTime').textContent = Math.ceil((Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) / Game.fps);
			numberOfTimers++;
		}
		else CM.Disp.TimerBars.CMTimerBarGC.style.display = 'none';

		// Regulates visibility of Reindeer timer
		if (Game.season === 'christmas' && Game.shimmerTypes.reindeer.spawned === 0) {
			CM.Disp.TimerBars. CMTimerBarRen.style.display = '';
			l('CMTimerBarRenMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes.reindeer.minTime - Game.shimmerTypes.reindeer.time) * maxWidthTwoBar / Game.shimmerTypes.reindeer.maxTime) + 'px';
			if (CM.Options.TimerBarOverlay >=  1) l('CMTimerBarRenMinBar').textContent = Math.ceil((Game.shimmerTypes.reindeer.minTime - Game.shimmerTypes.reindeer.time)/ Game.fps);
			else l('CMTimerBarRenMinBar').textContent = "";
			l('CMTimerBarRenBar').style.width = Math.round(Math.min(Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.minTime, Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) * maxWidthTwoBar / Game.shimmerTypes.reindeer.maxTime) + 'px';
			if (CM.Options.TimerBarOverlay >=  1) l('CMTimerBarRenBar').textContent = Math.ceil(Math.min(Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.minTime, Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) / Game.fps);
			else l('CMTimerBarRenBar').textContent = "";
			l('CMTimerBarRenTime').textContent = Math.ceil((Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) / Game.fps);
			numberOfTimers++;
		}
		else {
			CM.Disp.TimerBars. CMTimerBarRen.style.display = 'none';
		}

		// On every frame all buff-timers are deleted and re-created
		for (let i of Object.keys(CM.Disp.BuffTimerBars)) {
			CM.Disp.BuffTimerBars[i].remove();
		}
		CM.Disp.BuffTimerBars = {};
		for (let i of Object.keys(Game.buffs)) {
			if (Game.buffs[i]) {
				let timer = CM.Disp.TimerBarCreateBar(Game.buffs[i].name, Game.buffs[i].name, [{id: Game.buffs[i].name + 'Bar'}]);
				timer.style.display = '';
				let classColor = '';
				// Gives specific timers specific colors
				if (typeof CM.Disp.buffColors[Game.buffs[i].name] !== 'undefined') {
					classColor = CM.Disp.buffColors[Game.buffs[i].name];
				}
				else classColor = CM.Disp.colorPurple;
				timer.lastChild.children[1].className = CM.Disp.colorBackPre + classColor;
				timer.lastChild.children[1].style.color = "black";
				if (CM.Options.TimerBarOverlay === 2) timer.lastChild.children[1].textContent = Math.round(100 * (Game.buffs[i].time / Game.buffs[i].maxTime)) + "%";
				else timer.lastChild.children[1].textContent = "";
				timer.lastChild.children[1].style.width = Math.round(Game.buffs[i].time * (maxWidthOneBar - Math.ceil(Game.buffs[i].time / Game.fps).toString().length * 8) / Game.buffs[i].maxTime) + 'px';
				timer.lastChild.children[2].textContent = Math.ceil(Game.buffs[i].time / Game.fps);
				numberOfTimers++;
				CM.Disp.BuffTimerBars[Game.buffs[i].name] = timer;
			}
		}
		for (let i of Object.keys(CM.Disp.BuffTimerBars)) {
			CM.Disp.TimerBar.appendChild(CM.Disp.BuffTimerBars[i]);
		}

		if (numberOfTimers != 0) {
			CM.Disp.TimerBar.style.height = numberOfTimers * 12 + 2 + 'px';
		}
		if (CM.Disp.LastNumberOfTimers != numberOfTimers) {
			CM.Disp.LastNumberOfTimers = numberOfTimers;
			CM.Disp.UpdateBotTimerBarPosition();
		}
	}
};

/**
 * This function changes the visibility of the timer bar
 * It is called by CM.Disp.UpdateAscendState() or a change in CM.Options.TimerBar
 */
CM.Disp.ToggleTimerBar = function() {
	if (CM.Options.TimerBar === 1) CM.Disp.TimerBar.style.display = '';
	else CM.Disp.TimerBar.style.display = 'none';
	CM.Disp.UpdateBotTimerBarPosition();
};

/**
 * This function changes the position of the timer bar
 * It is called by a change in CM.Options.TimerBarPos
 */
CM.Disp.ToggleTimerBarPos = function() {
	if (CM.Options.TimerBarPos === 0) {
		CM.Disp.TimerBar.style.width = '30%';
		CM.Disp.TimerBar.style.bottom = '';
		l('game').insertBefore(CM.Disp.TimerBar, l('sectionLeft'));
	}
	else {
		CM.Disp.TimerBar.style.width = '100%';
		CM.Disp.TimerBar.style.bottom = '0px';
		l('wrapper').appendChild(CM.Disp.TimerBar);
	}
	CM.Disp.UpdateBotTimerBarPosition();
};

/********
 * Section: Functions related to the both the bottom and timer bar

/**
 * This function changes the position of both the bottom and timer bar
 * It is called by CM.Disp.ToggleTimerBar(), CM.Disp.ToggleTimerBarPos() and CM.Disp.ToggleBotBar()
 */
CM.Disp.UpdateBotTimerBarPosition = function() {
	if (CM.Options.BotBar === 1 && CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 1) {
		CM.Disp.BotBar.style.bottom = CM.Disp.TimerBar.style.height;
		l('game').style.bottom = Number(CM.Disp.TimerBar.style.height.replace("px","")) + 70 + "px";
	}
	else if (CM.Options.BotBar === 1) {
		CM.Disp.BotBar.style.bottom = '0px';
		l('game').style.bottom = '70px';
	}
	else if (CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 1) {
		l('game').style.bottom = CM.Disp.TimerBar.style.height;
	}
	else { // No bars
		l('game').style.bottom = '0px';
	}

	if (CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 0) {
		l('sectionLeft').style.top = CM.Disp.TimerBar.style.height;
	}
	else {
		l('sectionLeft').style.top = '';
	}

	CM.Disp.UpdateBackground();
};

/********
 * Section: Functions related to right column of the screen (buildings/upgrades)

/**
 * This function adjusts some things in the column of buildings.
 * It colours them, helps display the correct sell-price and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.UpdateColors() & CM.Disp.RefreshScale()
 * And by changes in CM.Options.BuildColor, CM.Options.SortBuild & CM.Data.Config.BulkBuildColor
 */
CM.Disp.UpdateBuildings = function() {
	let target = `Objects${Game.buyBulk}`
	if  (Game.buyMode === 1) {
		if (CM.Options.BuildColor === 1) {
			for (let i of Object.keys(CM.Cache[target])) {
				l('productPrice' + Game.Objects[i].id).style.color = CM.Options.Colors[CM.Cache[target][i].color];
			}
		} else {
			for (let i of Object.keys(Game.Objects)) {
				l('productPrice' + Game.Objects[i].id).style.removeProperty("color");
			}
		}
	}
	else if (Game.buyMode === -1) {
		for (let i of Object.keys(CM.Cache.Objects1)) {
			let o = Game.Objects[i];
			l('productPrice' + o.id).style.color = '';
			/*
			 * Fix sell price displayed in the object in the store.
			 *
			 * The buildings sell price displayed by the game itself (without any mod) is incorrect.
			 * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
			 * 
			 * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
			 */
			l('productPrice' + o.id).innerHTML = Beautify(CM.Sim.BuildingSell(o, o.basePrice, o.amount, o.free, Game.buyBulk, 1));
		}
	}
	
	// Build array of pointers, sort by pp, use array index (+2) as the grid row number
	// (grid rows are 1-based indexing, and row 1 is the bulk buy/sell options)
	// This regulates sorting of buildings
	if (Game.buyMode === 1 && CM.Options.SortBuildings) {
		let arr = Object.keys(CM.Cache[target]).map(k =>
		{
			let o = CM.Cache[target][k];
			o.name = k;
			o.id = Game.Objects[k].id;
			return o;
		});

		arr.sort(function(a, b){ return (CM.Disp.colors.indexOf(a.color) > CM.Disp.colors.indexOf(b.color) ? 1 : (CM.Disp.colors.indexOf(a.color) < CM.Disp.colors.indexOf(b.color) ? -1 : 0)); });
	
		for (let x = 0; x < arr.length; x++) {
			Game.Objects[arr[x].name].l.style.gridRow = (x + 2) + "/" + (x + 2);
		}
	} else {
		let arr = Object.keys(CM.Cache.Objects1).map(k =>
			{
				let o = CM.Cache.Objects1[k];
				o.name = k;
				o.id = Game.Objects[k].id;
				return o;
			});
		arr.sort((a, b) => a.id - b.id);
		for (let x = 0; x < arr.length; x++) {
			Game.Objects[arr[x].name].l.style.gridRow = (x + 2) + "/" + (x + 2);
		}
	}
};

/**
 * This function adjusts some things in the upgrades section
 * It colours them and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.ToggleUpgradeBarAndColor & CM.Disp.RefreshScale()
 * And by changes in CM.Options.SortUpgrades
 */
CM.Disp.UpdateUpgrades = function() {
	// This counts the amount of upgrades for each pp group and updates the Upgrade Bar
	if (CM.Options.UpBarColor > 0) {
		let blue = 0;
		let green = 0;
		let yellow = 0;
		let orange = 0;
		let red = 0;
		let purple = 0;
		let gray = 0;

		for (let i of Object.keys(Game.UpgradesInStore)) {
			let me = Game.UpgradesInStore[i];
			let addedColor = false;
			for (let j = 0; j < l('upgrade' + i).childNodes.length; j++) {
				if (l('upgrade' + i).childNodes[j].className.indexOf(CM.Disp.colorBackPre) != -1) {
					l('upgrade' + i).childNodes[j].className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
					addedColor = true;
					break;
				}
			}
			if (!addedColor) {
				let div = document.createElement('div');
				div.style.width = '10px';
				div.style.height = '10px';
				div.className = CM.Disp.colorBackPre + CM.Cache.Upgrades[me.name].color;
				l('upgrade' + i).appendChild(div);
			}
			if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorBlue) blue++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorGreen) green++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorYellow) yellow++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorOrange) orange++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorRed) red++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorPurple) purple++;
			else if (CM.Cache.Upgrades[me.name].color === CM.Disp.colorGray) gray++;
		}

		l('CMUpgradeBarBlue').textContent = blue;
		l('CMUpgradeBarGreen').textContent = green;
		l('CMUpgradeBarYellow').textContent = yellow;
		l('CMUpgradeBarOrange').textContent = orange;
		l('CMUpgradeBarRed').textContent = red;
		l('CMUpgradeBarPurple').textContent = purple;
		l('CMUpgradeBarGray').textContent = gray;
	}
	
	// Build array of pointers, sort by pp, set flex positions
	// This regulates sorting of upgrades
	let arr = [];
	for (let x = 0; x < Game.UpgradesInStore.length; x++){
		let o = {};
		o.name = Game.UpgradesInStore[x].name;
		o.price = Game.UpgradesInStore[x].basePrice;
		o.pp = CM.Cache.Upgrades[o.name].pp;
		arr.push(o);
	}

	if (CM.Options.SortUpgrades) {
		arr.sort((a, b) => CM.Disp.colors.indexOf(a.color) - CM.Disp.colors.indexOf(b.color));
	}
	else {
		arr.sort((a, b) => a.price - b.price);
	}
	
	let nameChecker = function(arr, upgrade) {
		return arr.findIndex(e => e.name === upgrade.name);
	};
	for (let x = 0; x < Game.UpgradesInStore.length; x++){
		l("upgrade" + x).style.order = nameChecker(arr, Game.UpgradesInStore[x]) + 1;
	}
};

/********
 * Section: Functions related to the Upgrade Bar

/**
 * This function toggles the upgrade bar and the colours of upgrades
 * It is called by a change in CM.Options.UpBarColor
 */
CM.Disp.ToggleUpgradeBarAndColor = function() {
	if (CM.Options.UpBarColor === 1) { // Colours and bar on
		CM.Disp.UpgradeBar.style.display = '';
		CM.Disp.UpdateUpgrades();
	}
	else if (CM.Options.UpBarColor === 2) {// Colours on and bar off
		CM.Disp.UpgradeBar.style.display = 'none';
		CM.Disp.UpdateUpgrades();
	}
	else { // Colours and bar off
		CM.Disp.UpgradeBar.style.display = 'none';
		Game.RebuildUpgrades();
	}
};

/**
 * This function toggles the position of the upgrade bar from fixed or non-fixed mode
 * It is called by a change in CM.Options.UpgradeBarFixedPos
 */
CM.Disp.ToggleUpgradeBarFixedPos = function() {
	if (CM.Options.UpgradeBarFixedPos === 1) { // Fix to top of screen when scrolling
		CM.Disp.UpgradeBar.style.position = 'sticky';
		CM.Disp.UpgradeBar.style.top = '0px';
	}
	else {
		CM.Disp.UpgradeBar.style.position = ''; // Possible to scroll offscreen
	}
};

/**
 * This function creates the upgrade bar above the upgrade-section in the right section of the screen
 * The number (.textContent) of upgrades gets updated by CM.Disp.UpdateUpgrades()
 */
CM.Disp.CreateUpgradeBar = function() {
	CM.Disp.UpgradeBar = document.createElement('div');
	CM.Disp.UpgradeBar.id = 'CMUpgradeBar';
	CM.Disp.UpgradeBar.style.width = '100%';
	CM.Disp.UpgradeBar.style.backgroundColor = 'black';
	CM.Disp.UpgradeBar.style.textAlign = 'center';
	CM.Disp.UpgradeBar.style.fontWeight = 'bold';
	CM.Disp.UpgradeBar.style.display = 'none';
	CM.Disp.UpgradeBar.style.zIndex = '21';
	CM.Disp.UpgradeBar.onmouseout = function() { Game.tooltip.hide(); };

	let placeholder = document.createElement('div');
	placeholder.appendChild(CM.Disp.CreateUpgradeBarLegend());
	CM.Disp.UpgradeBar.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML), 'store');};

	let upgradeNumber = function(id, color) {
		let span = document.createElement('span');
		span.id = id;
		span.className = CM.Disp.colorTextPre + color;
		span.style.width = '14.28571428571429%';
		span.style.display = 'inline-block';
		span.textContent = '0';
		return span;
	};
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarBlue', CM.Disp.colorBlue));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGreen', CM.Disp.colorGreen));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarYellow', CM.Disp.colorYellow));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarOrange', CM.Disp.colorOrange));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarRed', CM.Disp.colorRed));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarPurple', CM.Disp.colorPurple));
	CM.Disp.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGray', CM.Disp.colorGray));

	l('upgrades').parentNode.insertBefore(CM.Disp.UpgradeBar, l('upgrades').parentNode.childNodes[3]);
};

/**
 * This function creates the legend for the upgrade bar, it is called by CM.Disp.CreateUpgradeBar
 * @returns	{object}	legend	The legend-object to be added
 */
CM.Disp.CreateUpgradeBarLegend = function() {
	let legend = document.createElement('div');
	legend.style.minWidth = '330px';
	legend.style.marginBottom = '4px';
	let title = document.createElement('div');
	title.className = 'name';
	title.style.marginBottom = '4px';
	title.textContent = 'Legend';
	legend.appendChild(title);

	let legendLine = function(color, text) {
		let div = document.createElement('div');
		div.style.verticalAlign = 'middle';
		let span = document.createElement('span');
		span.className = CM.Disp.colorBackPre + color;
		span.style.display = 'inline-block';
		span.style.height = '10px';
		span.style.width = '10px';
		span.style.marginRight = '4px';
		div.appendChild(span);
		div.appendChild(document.createTextNode(text));
		return div;
	};

	legend.appendChild(legendLine(CM.Disp.colorBlue, 'Better than best PP building'));
	legend.appendChild(legendLine(CM.Disp.colorGreen, 'Same as best PP building'));
	legend.appendChild(legendLine(CM.Disp.colorYellow, 'Between best and worst PP buildings closer to best'));
	legend.appendChild(legendLine(CM.Disp.colorOrange, 'Between best and worst PP buildings closer to worst'));
	legend.appendChild(legendLine(CM.Disp.colorRed, 'Same as worst PP building'));
	legend.appendChild(legendLine(CM.Disp.colorPurple, 'Worse than worst PP building'));
	legend.appendChild(legendLine(CM.Disp.colorGray, 'Negative or infinity PP'));
	return legend;
};

/********
 * Section: Functions related to the flashes/sound/notifications

/**
 * This function creates a white square over the full screen and appends it to l('wrapper')
 * It is used by CM.Disp.Flash() to create the effect of a flash and called by CM.Main.DelayInit()
 */
CM.Disp.CreateWhiteScreen = function() {
	CM.Disp.WhiteScreen = document.createElement('div');
	CM.Disp.WhiteScreen.id = 'CMWhiteScreen';
	CM.Disp.WhiteScreen.style.width = '100%';
	CM.Disp.WhiteScreen.style.height = '100%';
	CM.Disp.WhiteScreen.style.backgroundColor = 'white';
	CM.Disp.WhiteScreen.style.display = 'none';
	CM.Disp.WhiteScreen.style.zIndex = '9999999999';
	CM.Disp.WhiteScreen.style.position = 'absolute';
	l('wrapper').appendChild(CM.Disp.WhiteScreen);
};

/**
 * This function creates a flash depending on configs. It is called by all functions 
 * that check game-events and which have settings for Flashes (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{number}	mode	Sets the intensity of the flash, used to recursively dim flash
 * 								All calls of function have use mode === 3
 * @param	{string}	config	The setting in CM.Options that is checked before creating the flash
 */
CM.Disp.Flash = function(mode, config) {
	// The arguments check makes the sound not play upon initialization of the mod
	if ((CM.Options[config] === 1 && mode === 3 && CM.Footer.isInitzializing === false) || mode === 1) {
		CM.Disp.WhiteScreen.style.opacity = '0.5';
		if (mode === 3) {
			CM.Disp.WhiteScreen.style.display = 'inline';
			setTimeout(function() {CM.Disp.Flash(2, config);}, 1000/Game.fps);
		}
		else {
			setTimeout(function() {CM.Disp.Flash(0, config);}, 1000/Game.fps);
		}
	}
	else if (mode === 2) {
		CM.Disp.WhiteScreen.style.opacity = '1';
		setTimeout(function() {CM.Disp.Flash(1, config);}, 1000/Game.fps);
	}
	else if (mode === 0) CM.Disp.WhiteScreen.style.display = 'none';
};

/**
 * This function plays a sound depending on configs. It is called by all functions 
 * that check game-events and which have settings for sound (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{variable}	url			A variable that gives the url for the sound (e.g., CM.Options.GCSoundURL)
 * @param	{string}	sndConfig	The setting in CM.Options that is checked before creating the sound
 * @param	{string}	volConfig	The setting in CM.Options that is checked to determine volume
 */
CM.Disp.PlaySound = function(url, sndConfig, volConfig) {
	// The arguments check makes the sound not play upon initialization of the mod
	if (CM.Options[sndConfig] === 1 && CM.Footer.isInitzializing === false) {
		let sound = new realAudio(url);
		if (CM.Options.GeneralSound) sound.volume = (CM.Options[volConfig] / 100) * (Game.volume / 100);
		else sound.volume = (CM.Options[volConfig] / 100);
		sound.play();
	}
};

/**
 * This function creates a notifcation depending on configs. It is called by all functions 
 * that check game-events and which have settings for notifications (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{string}	notifyConfig	The setting in CM.Options that is checked before creating the notification
 * @param	{string}	title			The title of the to-be created notifications
 * @param	{string}	message			The text of the to-be created notifications
 */
CM.Disp.Notification = function(notifyConfig, title, message) {
	// The arguments check makes the sound not play upon initialization of the mod
	if (CM.Options[notifyConfig] === 1 && document.visibilityState === 'hidden' && CM.Footer.isInitzializing === false) {
		let CookieIcon = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
		new Notification(title, {body: message, badge: CookieIcon});
	}
};

/********
 * Section: Functions related to updating the tab in the browser's tab-bar

/**
 * This function creates the Favicon, it is called by CM.Main.DelayInit()
 */
CM.Disp.CreateFavicon = function() {
	CM.Disp.Favicon = document.createElement('link');
	CM.Disp.Favicon.id = 'CMFavicon';
	CM.Disp.Favicon.rel = 'shortcut icon';
	CM.Disp.Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(CM.Disp.Favicon);
};

/**
 * This function updates the Favicon depending on whether a Golden Cookie has spawned
 * It is called on every loop by CM.Main.CheckGoldenCookie() or by a change in CM.Options.Favicon 
 * By relying on CM.Cache.spawnedGoldenShimmer it only changes for non-user spawned cookie
 */
CM.Disp.UpdateFavicon = function() {
	if (CM.Options.Favicon === 1 && CM.Main.lastGoldenCookieState > 0) {
		if (CM.Cache.spawnedGoldenShimmer.wrath) CM.Disp.Favicon.href = 'https://aktanusa.github.io/CookieMonster/favicon/wrathCookie.ico';
		else CM.Disp.Favicon.href = 'https://aktanusa.github.io/CookieMonster/favicon/goldenCookie.ico';
	}
	else CM.Disp.Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
};

/**
 * This function updates the tab title
 * It is called on every loop by Game.Logic() which also sets CM.Disp.Title to Game.cookies
 */
CM.Disp.UpdateTitle = function() {
	if (Game.OnAscend || CM.Options.Title === 0) {
		document.title = CM.Disp.Title;
	}
	else if (CM.Options.Title === 1) {
		let addFC = false;
		let addSP = false;
		let titleGC;
		let titleFC;
		let titleSP;
		
		if (CM.Cache.spawnedGoldenShimmer) {
			if (CM.Cache.spawnedGoldenShimmer.wrath) titleGC = `[W${Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps)}]`;
			else titleGC = `[G${Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps)}]`;
		}
		else if (!Game.Has('Golden switch [off]')) {
			titleGC = `[${Number(l('CMTimerBarGCMinBar').textContent) < 0 ? "!" : ""}${Math.ceil((Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) / Game.fps)}]`;
		}
		else titleGC = '[GS]';

		if (CM.Main.lastTickerFortuneState) {
			addFC = true;
			titleFC = '[F]';
		}

		if (Game.season === 'christmas') {
			addSP = true;
			if (CM.Main.lastSeasonPopupState) titleSP = `[R${Math.ceil(CM.Cache.seasonPopShimmer.life / Game.fps)}]`;
			else {
				
				titleSP = `[${Number(l('CMTimerBarRenMinBar').textContent) < 0 ? "!" : ""}${Math.ceil((Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) / Game.fps)}]`;
			}
		}

		// Remove previous timers and add current cookies
		let str = CM.Disp.Title;
		if (str.charAt(0) === '[') {
			str = str.substring(str.lastIndexOf(']') + 1);
		}
		document.title = titleGC + (addFC ? titleFC : '') + (addSP ? titleSP : '') + ' ' + str;
	}
	else if (CM.Options.Title === 2) {
		let str = '';
		let spawn = false;
		if (CM.Cache.spawnedGoldenShimmer) {
			spawn = true;
			if (CM.Cache.spawnedGoldenShimmer.wrath) str += `[W${Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps)}]`;
			else str += `[G${Math.ceil(CM.Cache.spawnedGoldenShimmer.life / Game.fps)}]`;
		}
		if (CM.Main.lastTickerFortuneState) {
			spawn = true;
			str += '[F]';
		}
		if (Game.season === 'christmas' && CM.Main.lastSeasonPopupState) {
			str += `[R${Math.ceil(CM.Cache.seasonPopShimmer.life / Game.fps)}]`;
			spawn = true;
		}
		if (spawn) str += ' - ';
		let title = 'Cookie Clicker';
		if (Game.season === 'fools') title = 'Cookie Baker';
		str += title;
		document.title = str;
	}
};

/********
 * Section: Functions related to the Golden Cookie Timers

/**
 * This function creates a new Golden Cookie Timer and appends it CM.Disp.GCTimers based on the id of the cookie
 * It is called by CM.Main.CheckGoldenCookie()
 * @param	{object}	cookie	A Golden Cookie object
 */
CM.Disp.CreateGCTimer = function(cookie) {
	let GCTimer = document.createElement('div');
	GCTimer.id = 'GCTimer' + cookie.id;
	GCTimer.style.width = '96px';
	GCTimer.style.height = '96px';
	GCTimer.style.position = 'absolute';
	GCTimer.style.zIndex = '10000000001';
	GCTimer.style.textAlign = 'center';
	GCTimer.style.lineHeight = '96px';
	GCTimer.style.fontFamily = '"Kavoon", Georgia, serif';
	GCTimer.style.fontSize = '35px';
	GCTimer.style.cursor = 'pointer';
	GCTimer.style.display = 'block';
	if (CM.Options.GCTimer === 0) GCTimer.style.display = 'none';
	GCTimer.style.left = cookie.l.style.left;
	GCTimer.style.top = cookie.l.style.top;
	GCTimer.onclick = function () {cookie.pop();};
	GCTimer.onmouseover = function() {cookie.l.style.filter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; cookie.l.style.webkitFilter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))';};
	GCTimer.onmouseout = function() {cookie.l.style.filter = ''; cookie.l.style.webkitFilter = '';};

	CM.Disp.GCTimers[cookie.id] = GCTimer;
	l('shimmers').appendChild(GCTimer);
};

/**
 * This function toggles GC Timers are visible 
 * It is called by a change in CM.Options.GCTimer
 */
CM.Disp.ToggleGCTimer = function() {
	if (CM.Options.GCTimer === 1) {
		for (let i of Object.keys(CM.Disp.GCTimers)) {
			CM.Disp.GCTimers[i].style.display = 'block';
			CM.Disp.GCTimers[i].style.left = CM.Cache.goldenShimmersByID[i].l.style.left;
			CM.Disp.GCTimers[i].style.top = CM.Cache.goldenShimmersByID[i].l.style.top;
		}
	}
	else {
		for (let i of Object.keys(CM.Disp.GCTimers)) CM.Disp.GCTimers[i].style.display = 'none';
	}
};

/********
 * Section: Functions related to Tooltips

/**
 * This function creates some very basic tooltips, (e.g., the tooltips in the stats page)
 * The tooltips are created with CM.Disp[placeholder].appendChild(desc)
 * It is called by CM.Main.DelayInit()
 * @param	{string}	placeholder	The name used to later refer and spawn the tooltip
 * @param	{string}	text		The text of the tooltip
 * @param	{string}	minWidth	The minimum width of the tooltip
 */
CM.Disp.CreateSimpleTooltip = function(placeholder, text, minWidth) {
	CM.Disp[placeholder] = document.createElement('div');
	let desc = document.createElement('div');
	desc.style.minWidth = minWidth;
	desc.style.marginBottom = '4px';
	let div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = text;
	desc.appendChild(div);
	CM.Disp[placeholder].appendChild(desc);
};

/**
 * This function replaces the original .onmouseover functions of upgrades so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'u'
 * It is called by Game.RebuildUpgrades() through CM.Main.ReplaceNative() and is therefore not permanent like the other ReplaceTooltip functions
 */
CM.Disp.ReplaceTooltipUpgrade = function() {
	CM.Disp.TooltipUpgradeBackup = [];
	for (let i of Object.keys(Game.UpgradesInStore)) {
		if (l('upgrade' + i).onmouseover != null) {
			CM.Disp.TooltipUpgradeBackup[i] = l('upgrade' + i).onmouseover;
			l('upgrade' + i).onmouseover = function() {if (!Game.mouseDown) {Game.setOnCrate(this); Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return CM.Disp.Tooltip('u', `${i}`);}, 'store'); Game.tooltip.wobble();}};
		}
	}
};

/**
 * This function enhance the standard tooltips by creating and changing l('tooltip')
 * The function is called by .onmouseover events that have replaced original code to use CM.Disp.Tooltip()
 * @param	{string}	type					Type of tooltip (b, u, s or g)
 * @param	{string}	name					Name of the object/item the tooltip relates to
 * @returns {string}	l('tooltip').innerHTML	The HTML of the l('tooltip')-object
 */
CM.Disp.Tooltip = function(type, name) {
	if (type === 'b') { // Buildings
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		// Adds amortization info to the list of info per building
		if (CM.Options.TooltipAmor === 1) {
			let buildPrice = CM.Sim.BuildingGetPrice(Game.Objects[name], Game.Objects[name].basePrice, 0, Game.Objects[name].free, Game.Objects[name].amount);
			let amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML
					.split('so far</div>')
					.join('so far<br/>&bull; <b>' + Beautify(amortizeAmount) + '</b> ' + (Math.floor(amortizeAmount) === 1 ? 'cookie' : 'cookies') + ' left to amortize (' + CM.Disp.GetTimeColor((buildPrice - Game.Objects[name].totalCookies) / (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text + ')</div>');
			}
		}
		if (Game.buyMode === -1) {
			/*
			 * Fix sell price displayed in the object tooltip.
			 *
			 * The buildings sell price displayed by the game itself (without any mod) is incorrect.
			 * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
			 * 
			 * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
			 */
			l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].bulkPrice)).join(Beautify(CM.Sim.BuildingSell(Game.Objects[name], Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.buyBulk, 1)));
		}
	}
	else if (type === 'u') { // Upgrades
		if (!Game.UpgradesInStore[name]) return '';
		l('tooltip').innerHTML = Game.crateTooltip(Game.UpgradesInStore[name], 'store');
	}
	else if (type === 's') l('tooltip').innerHTML = Game.lumpTooltip(); // Sugar Lumps
	else if (type === 'g') l('tooltip').innerHTML = Game.Objects['Wizard tower'].minigame.spellTooltip(name)(); // Grimoire
	else if (type === 'p') l('tooltip').innerHTML =  Game.ObjectsById[2].minigame.tileTooltip(name[0], name[1])(); // Garden plots
	else if (type === 'ha') l('tooltip').innerHTML =  Game.ObjectsById[2].minigame.toolTooltip(1)(); // Harvest all button in garden

	// Adds area for extra tooltip-sections
	if ((type === 'b' && Game.buyMode === 1) || type === 'u' || type === 's' || type === 'g' || type === 'p' || type === 'ha') {
		let area = document.createElement('div');
		area.id = 'CMTooltipArea';
		l('tooltip').appendChild(area);
	}
	
	// Sets global variables used by CM.Disp.UpdateTooltip()
	CM.Disp.tooltipType = type;
	CM.Disp.tooltipName = name;

	CM.Disp.UpdateTooltip();

	return l('tooltip').innerHTML;
};

/**
 * This function creates a tooltipBox object which contains all CookieMonster added tooltip information.
 * It is called by all CM.Disp.UpdateTooltip functions.
 * @returns {object}	div		An object containing the stylized box
 */
CM.Disp.TooltipCreateTooltipBox = function() {
	l('tooltip').firstChild.style.paddingBottom = '4px'; // Sets padding on base-tooltip
	let tooltipBox = document.createElement('div');
	tooltipBox.style.border = '1px solid';
	tooltipBox.style.padding = '4px';
	tooltipBox.style.margin = '0px -4px';
	tooltipBox.id = 'CMTooltipBorder';
	tooltipBox.className = CM.Disp.colorTextPre + CM.Disp.colorGray;
	return tooltipBox;
};

/**
 * This function creates a header object for tooltips. 
 * It is called by all CM.Disp.UpdateTooltip functions.
 * @param	{string}	text	Title of header
 * @returns {object}	div		An object containing the stylized header
 */
CM.Disp.TooltipCreateHeader = function(text) {
	let div = document.createElement('div');
	div.style.fontWeight = 'bold';
	div.className = CM.Disp.colorTextPre + CM.Disp.colorBlue;
	div.textContent = text;
	return div;
};

/**
 * This function appends the sections for Bonus Income, PP and Time left (to achiev) to the tooltip-object
 * It is called by CM.Disp.UpdateTooltipBuilding() and CM.Disp.UpdateTooltipUpgrade()
 * The actual data is added by the Update-functions themselves
 * @param	{object}	tooltip		Object of a TooltipBox, normally created by a call to CM.Disp.TooltipCreateTooltipBox()
 */
CM.Disp.TooltipCreateCalculationSection = function(tooltip) {
	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Bonus Income'));
	let income = document.createElement('div');
	income.style.marginBottom = '4px';
	income.style.color = 'white';
	income.id = 'CMTooltipIncome';
	tooltip.appendChild(income);

	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Bonus Cookies per Click'));
	tooltip.lastChild.style.display = "none";
	let click = document.createElement('div');
	click.style.marginBottom = '4px';
	click.style.color = 'white';
	click.style.display = "none";
	click.id = 'CMTooltipCookiePerClick';
	tooltip.appendChild(click);

	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Payback Period'));
	let pp = document.createElement('div');
	pp.style.marginBottom = '4px';
	pp.id = 'CMTooltipPP';
	tooltip.appendChild(pp);

	tooltip.appendChild(CM.Disp.TooltipCreateHeader('Time Left'));
	let time = document.createElement('div');
	time.id = 'CMTooltipTime';
	tooltip.appendChild(time);

	if (CM.Disp.tooltipType === 'b') {
		tooltip.appendChild(CM.Disp.TooltipCreateHeader('Production left till next achievement'));
		tooltip.lastChild.id = 'CMTooltipProductionHeader'; // Assign a id in order to hid when no achiev's are left
		let production = document.createElement('div');
		production.id = 'CMTooltipProduction';
		tooltip.appendChild(production);
	}
};

/**
 * This function creates the tooltip objectm for warnings
 * It is called by CM.Disp.UpdateTooltipWarnings() whenever the tooltip type is 'b' or 'u'
 * The object is also removed by CM.Disp.UpdateTooltipWarnings() when type is 's' or 'g'
 * @returns {object}	CM.Disp.TooltipWarn	The Warnings-tooltip object
 */
CM.Disp.TooltipCreateWarningSection = function() {
	CM.Disp.TooltipWarn = document.createElement('div');
	CM.Disp.TooltipWarn.style.position = 'absolute';
	CM.Disp.TooltipWarn.style.display = 'block';
	CM.Disp.TooltipWarn.style.left = 'auto';
	CM.Disp.TooltipWarn.style.bottom = 'auto';
	CM.Disp.TooltipWarn.id = "CMDispTooltipWarningParent";

	let create = function(boxId, color, labelTextFront, labelTextBack, deficitId) {
		let box = document.createElement('div');
		box.id = boxId;
		box.style.display = 'none';
		box.style.transition = 'opacity 0.1s ease-out';
		box.className = CM.Disp.colorBorderPre + color;
		box.style.padding = '2px';
		box.style.background = '#000 url(img/darkNoise.png)';
		let labelDiv = document.createElement('div');
		box.appendChild(labelDiv);
		let labelSpan = document.createElement('span');
		labelSpan.className = CM.Disp.colorTextPre + color;
		labelSpan.style.fontWeight = 'bold';
		labelSpan.textContent = labelTextFront;
		labelDiv.appendChild(labelSpan);
		labelDiv.appendChild(document.createTextNode(labelTextBack));
		let deficitDiv = document.createElement('div');
		box.appendChild(deficitDiv);
		let deficitSpan = document.createElement('span');
		deficitSpan.id = deficitId;
		deficitDiv.appendChild(document.createTextNode('Deficit: '));
		deficitDiv.appendChild(deficitSpan);
		return box;
	};
  
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnLucky', CM.Disp.colorRed, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!"', 'CMDispTooltipWarnLuckyText'));
	CM.Disp.TooltipWarn.firstChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnLuckyFrenzy', CM.Disp.colorYellow, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)', 'CMDispTooltipWarnLuckyFrenzyText'));
	CM.Disp.TooltipWarn.lastChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnConjure', CM.Disp.colorPurple, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Conjure Baked Goods"', 'CMDispTooltipWarnConjureText'));
	CM.Disp.TooltipWarn.lastChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnConjureFrenzy', CM.Disp.colorPurple, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Conjure Baked Goods" (Frenzy)', 'CMDispTooltipWarnConjureFrenzyText'));
	CM.Disp.TooltipWarn.lastChild.style.marginBottom = '4px';
	CM.Disp.TooltipWarn.appendChild(create('CMDispTooltipWarnEdifice', CM.Disp.colorPurple, 'Warning: ', 'Purchase of this item will put you under the number of Cookies needed for "Spontaneous Edifice" to possibly give you your most expensive building"', 'CMDispTooltipWarnEdificeText'));
	
	return CM.Disp.TooltipWarn;
};

/**
 * This function updates the sections of the tooltips created by CookieMonster
 * It is called when tooltips are created by and CM.Disp.Tooltip() on every loop by CM.Disp.Draw()
 */
CM.Disp.UpdateTooltip = function() {
	CM.Sim.CopyData();
	if (l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea')) {
		l('CMTooltipArea').innerHTML = '';
		let tooltipBox = CM.Disp.TooltipCreateTooltipBox();
		l('CMTooltipArea').appendChild(tooltipBox);
		
		if (CM.Disp.tooltipType === 'b') {
			CM.Disp.UpdateTooltipBuilding();
		}
		else if (CM.Disp.tooltipType === 'u') { 
			CM.Disp.UpdateTooltipUpgrade();
		}
		else if (CM.Disp.tooltipType === 's') {
			CM.Disp.UpdateTooltipSugarLump();
		}
		else if (CM.Disp.tooltipType === 'g') {
			CM.Disp.UpdateTooltipGrimoire();
		}
		else if (CM.Disp.tooltipType === 'p') {
			CM.Disp.UpdateTooltipGardenPlots();
		}
		else if (CM.Disp.tooltipType === 'ha') {
			CM.Disp.UpdateTooltipHarvestAll();
		}
		CM.Disp.UpdateTooltipWarnings();
	}
	else if (l('CMTooltipArea') === null) { // Remove warnings if its a basic tooltip
		if (l('CMDispTooltipWarningParent') != null) {
			l('CMDispTooltipWarningParent').remove();
		}
	}
};

/**
 * This function adds extra info to the Building tooltips
 * It is called when Building tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipBuilding = function() {
	if (CM.Options.TooltipBuildUpgrade === 1 && Game.buyMode === 1) {
		let tooltipBox = l('CMTooltipBorder');
		CM.Disp.TooltipCreateCalculationSection(tooltipBox);

		let target = `Objects${Game.buyBulk}`

		CM.Disp.TooltipPrice = Game.Objects[CM.Disp.tooltipName].bulkPrice;
		CM.Disp.TooltipBonusIncome = CM.Cache[target][CM.Disp.tooltipName].bonus;
		

		if (CM.Options.TooltipBuildUpgrade === 1 && Game.buyMode === 1) {
			l('CMTooltipIncome').textContent = Beautify(CM.Disp.TooltipBonusIncome, 2);
			let increase = Math.round(CM.Disp.TooltipBonusIncome / Game.cookiesPs * 10000);
			if (isFinite(increase) && increase != 0) {
				l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
			}
			l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			l('CMTooltipPP').textContent = Beautify(CM.Cache[target][CM.Disp.tooltipName].pp, 2);
			l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache[target][CM.Disp.tooltipName].color;
			let timeColor = CM.Disp.GetTimeColor((CM.Disp.TooltipPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
			l('CMTooltipTime').textContent = timeColor.text;
			if (timeColor.text === "Done!" && Game.cookies < CM.Cache[target][CM.Disp.tooltipName].price) {
				l('CMTooltipTime').textContent = timeColor.text + " (with Wrink)";
			}
			else l('CMTooltipTime').textContent = timeColor.text;
			l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
		}

		// Add "production left till next achievement"-bar
		l('CMTooltipProductionHeader').style.display = "none";
		l('CMTooltipTime').style.marginBottom = '0px';
		for (let i of Object.keys(Game.Objects[CM.Disp.tooltipName].productionAchievs)) {
			if (!Game.HasAchiev(Game.Objects[CM.Disp.tooltipName].productionAchievs[i].achiev.name)) {
				let nextProductionAchiev = Game.Objects[CM.Disp.tooltipName].productionAchievs[i];
				l('CMTooltipTime').style.marginBottom = '4px';
				l('CMTooltipProductionHeader').style.display = "";
				l('CMTooltipProduction').className = "ProdAchievement" + CM.Disp.tooltipName;
				l('CMTooltipProduction').textContent = Beautify(nextProductionAchiev.pow - CM.Sim.Objects[CM.Disp.tooltipName].totalCookies, 15);
				l('CMTooltipProduction').style.color = "white";
				break;
			}
		}
	}
	else l('CMTooltipArea').style.display = "none";
};

/**
 * This function adds extra info to the Upgrade tooltips
 * It is called when Upgrade tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipUpgrade = function() {
	let tooltipBox = l('CMTooltipBorder');
	CM.Disp.TooltipCreateCalculationSection(tooltipBox);

	CM.Disp.TooltipBonusIncome = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonus;
	CM.Disp.TooltipPrice = Game.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].getPrice();
	CM.Disp.TooltipBonusMouse = CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].bonusMouse;

	if (CM.Options.TooltipBuildUpgrade === 1) {
		l('CMTooltipIncome').textContent = Beautify(CM.Disp.TooltipBonusIncome, 2);
		let increase = Math.round(CM.Disp.TooltipBonusIncome / Game.cookiesPs * 10000);
		if (isFinite(increase) && increase != 0) {
			l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
		}
		l('CMTooltipBorder').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
		// If clicking power upgrade
		if (CM.Disp.TooltipBonusMouse) {
			l('CMTooltipCookiePerClick').textContent = Beautify(CM.Disp.TooltipBonusMouse);
			l('CMTooltipCookiePerClick').style.display = "block";
			l('CMTooltipCookiePerClick').previousSibling.style.display = "block";
		}
		// If only a clicking power upgrade change PP to click-based period
		if (CM.Disp.TooltipBonusIncome === 0 && CM.Disp.TooltipBonusMouse) {	
			l('CMTooltipPP').textContent = Beautify(CM.Disp.TooltipPrice / CM.Disp.TooltipBonusMouse) + ' Clicks';
			l('CMTooltipPP').style.color = "white";
		}
		else {
			l('CMTooltipPP').textContent = Beautify(CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].pp, 2);
			l('CMTooltipPP').className = CM.Disp.colorTextPre + CM.Cache.Upgrades[Game.UpgradesInStore[CM.Disp.tooltipName].name].color;
		}
		let timeColor = CM.Disp.GetTimeColor((CM.Disp.TooltipPrice - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS());
		l('CMTooltipTime').textContent = timeColor.text;
		if (timeColor.text === "Done!" && Game.cookies < Game.UpgradesInStore[CM.Disp.tooltipName].getPrice()) {
			l('CMTooltipTime').textContent = timeColor.text + " (with Wrink)";
		}
		else l('CMTooltipTime').textContent = timeColor.text;
		l('CMTooltipTime').className = CM.Disp.colorTextPre + timeColor.color;
		
		// Add extra info to Chocolate egg tooltip
		if (Game.UpgradesInStore[CM.Disp.tooltipName].name === "Chocolate egg") {
			l('CMTooltipBorder').lastChild.style.marginBottom = '4px';
			l('CMTooltipBorder').appendChild(CM.Disp.TooltipCreateHeader('Cookies to be gained (Currently/Max)'));
			let chocolate = document.createElement('div');
			chocolate.style.color = 'white';
			chocolate.textContent = CM.Disp.Beautify(Game.cookies * 0.05) + " / " + CM.Disp.Beautify(CM.Cache.lastChoEgg);
			l('CMTooltipBorder').appendChild(chocolate);
		}
	}
	else l('CMTooltipArea').style.display = "none";
};

/**
 * This function adds extra info to the Sugar Lump tooltip
 * It is called when the Sugar Lump tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
CM.Disp.UpdateTooltipSugarLump = function() {
	if (CM.Options.TooltipLump === 1) {
		let tooltipBox = l('CMTooltipBorder');

		tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Current Sugar Lump'));

		let lumpType = document.createElement('div');
		lumpType.id = 'CMTooltipTime';
		tooltipBox.appendChild(lumpType);
		let lumpColor = CM.Disp.GetLumpColor(Game.lumpCurrentType);
		lumpType.textContent = lumpColor.text;
		lumpType.className = CM.Disp.colorTextPre + lumpColor.color;
	}
	else l('CMTooltipArea').style.display = "none";
};

/**
 * This function adds extra info to the Grimoire tooltips
 * It is called when Grimoire tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
CM.Disp.UpdateTooltipGrimoire = function() {
	let minigame = Game.Objects['Wizard tower'].minigame;
	let spellCost = minigame.getSpellCost(minigame.spellsById[CM.Disp.tooltipName]);

	if (CM.Options.TooltipGrim === 1 && spellCost <= minigame.magicM) {
		let tooltipBox = l('CMTooltipBorder');

		// Time left till enough magic for spell
		tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Time Left'));
		let time = document.createElement('div');
		time.id = 'CMTooltipTime';
		tooltipBox.appendChild(time);
		let timeColor = CM.Disp.GetTimeColor(CM.Disp.CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, spellCost));
		time.textContent = timeColor.text;
		time.className = CM.Disp.colorTextPre + timeColor.color;

		// Time left untill magic spent is recovered
		if (spellCost <= minigame.magic) {
			tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Recover Time'));
			let recover = document.createElement('div');
			recover.id = 'CMTooltipRecover';
			tooltipBox.appendChild(recover);
			let recoverColor = CM.Disp.GetTimeColor(CM.Disp.CalculateGrimoireRefillTime(Math.max(0, minigame.magic - spellCost), minigame.magicM, minigame.magic));
			recover.textContent = recoverColor.text;
			recover.className = CM.Disp.colorTextPre + recoverColor.color;
		}

		// Extra information on cookies gained when spell is Conjure Baked Goods (Name === 0)
		if (CM.Disp.tooltipName === 0) {
			tooltipBox.appendChild(CM.Disp.TooltipCreateHeader('Cookies to be gained/lost'));
			let conjure = document.createElement('div');
			conjure.id = 'CMTooltipConjure';
			tooltipBox.appendChild(conjure);
			let reward = document.createElement('span');
			reward.style.color = "#33FF00";
			reward.textContent = Beautify(Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 30), 2);
			conjure.appendChild(reward);
			let seperator = document.createElement('span');
			seperator.textContent = ' / ';
			conjure.appendChild(seperator);
			let loss = document.createElement('span');
			loss.style.color = "red";
			loss.textContent = Beautify((CM.Cache.NoGoldSwitchCookiesPS * 60 * 15), 2);
			conjure.appendChild(loss);
		}

		l('CMTooltipArea').appendChild(tooltipBox);
	}
	else l('CMTooltipArea').style.display = "none";
};

/**
 * This function adds extra info to the Garden plots tooltips
 * It is called when Garden plots tooltips are created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
CM.Disp.UpdateTooltipGardenPlots = function() {
	let minigame = Game.Objects.Farm.minigame;
	if (CM.Options.TooltipLump && minigame.plot[CM.Disp.tooltipName[1]][CM.Disp.tooltipName[0]][0] != 0) {
			let mature = minigame.plot[CM.Disp.tooltipName[1]][CM.Disp.tooltipName[0]][1] > minigame.plantsById[minigame.plot[CM.Disp.tooltipName[1]][CM.Disp.tooltipName[0]][0] - 1].matureBase;
			let plantName = minigame.plantsById[minigame.plot[CM.Disp.tooltipName[1]][CM.Disp.tooltipName[0]][0] - 1].name;
			l('CMTooltipBorder').appendChild(CM.Disp.TooltipCreateHeader('Reward (Current / Maximum)'));
			let reward = document.createElement('div');
			reward.id = 'CMTooltipPlantReward';
			l('CMTooltipBorder').appendChild(reward);
			if (plantName === "Bakeberry") {
				l('CMTooltipPlantReward').textContent = (mature ? CM.Disp.Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30)) : "0") + " / " + CM.Disp.Beautify(Game.cookiesPs * 60 * 30);
			} 
			else if (plantName === "Chocoroot" || plantName === "White chocoroot") {
				l('CMTooltipPlantReward').textContent = (mature ? CM.Disp.Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3)) : "0") + " / " + CM.Disp.Beautify(Game.cookiesPs * 60 * 3);
			}
			else if (plantName === "Queenbeet") {
				l('CMTooltipPlantReward').textContent = (mature ? CM.Disp.Beautify(Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60)) : "0") + " / " + CM.Disp.Beautify(Game.cookiesPs * 60 * 60);
			} 
			else if (plantName === "Duketater") {
				l('CMTooltipPlantReward').textContent = (mature ? CM.Disp.Beautify(Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120)) : "0") + " / " + CM.Disp.Beautify(Game.cookiesPs * 60 * 120);
			} 
			else l('CMTooltipArea').style.display = "none";
	}
	else l('CMTooltipArea').style.display = "none";
};

/**
 * This function adds extra info to the Garden Harvest All tooltip
 * It is called when the Harvest All tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
CM.Disp.UpdateTooltipHarvestAll = function() {
	let minigame = Game.Objects.Farm.minigame;
	if (CM.Options.TooltipLump) {
			l('CMTooltipBorder').appendChild(CM.Disp.TooltipCreateHeader('Cookies gained from harvesting:'));
			let totalGain = 0;
			let mortal = 0;
			if (Game.keys[16] && Game.keys[17]) mortal = 1;
			for (let y=0;y<6;y++) {
				for (let x=0; x<6; x++) {
					if (minigame.plot[y][x][0]>=1) {
						let tile = minigame.plot[y][x];
						let me = minigame.plantsById[tile[0] - 1];
						let plantName = me.name;

						let count = true;
						if (mortal && me.immortal) count = false;
						if (tile[1] < me.matureBase) count = false;
						if (count && plantName === "Bakeberry") {
							totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30);
						} 
						else if (count && plantName === "Chocoroot" || plantName === "White chocoroot") {
							totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3);
						}
						else if (count && plantName === "Queenbeet") {
							totalGain += Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60);
						} 
						else if (count && plantName === "Duketater") {
							totalGain += Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120);
						}
					}
				}
			}
			l('CMTooltipBorder').appendChild(document.createTextNode(CM.Disp.Beautify(totalGain)));
	}
	else l('CMTooltipArea').style.display = "none";
};

/**
 * This function updates the warnings section of the building and upgrade tooltips
 * It is called by CM.Disp.UpdateTooltip()
 */
CM.Disp.UpdateTooltipWarnings = function() {
	if (CM.Disp.tooltipType === "b" || CM.Disp.tooltipType === "u") {
		if (document.getElementById("CMDispTooltipWarningParent") === null) {
			let warningTooltip = CM.Disp.TooltipCreateWarningSection();
			l('tooltipAnchor').appendChild(warningTooltip);
			CM.Disp.ToggleToolWarnPos();
		}

		if (CM.Options.ToolWarnPos === 0) CM.Disp.TooltipWarn.style.right = '0px';
		else CM.Disp.TooltipWarn.style.top = (l('tooltip').offsetHeight) + 'px';

		CM.Disp.TooltipWarn.style.width = (l('tooltip').offsetWidth - 6) + 'px';

		let amount = (Game.cookies + CM.Disp.GetWrinkConfigBank()) - CM.Disp.TooltipPrice;
		let limitLucky = CM.Cache.Lucky;
		if (CM.Options.ToolWarnBon === 1) {
			let bonusNoFren = CM.Disp.TooltipBonusIncome;
			bonusNoFren /= CM.Cache.getCPSBuffMult();
			limitLucky += ((bonusNoFren * 60 * 15) / 0.15);
		}

		if (CM.Options.ToolWarnLucky === 1) {
			if (amount < limitLucky && (CM.Disp.tooltipType != 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnLucky').style.display = '';
				l('CMDispTooltipWarnLuckyText').textContent = Beautify(limitLucky - amount) + ' (' + CM.Disp.FormatTime((limitLucky - amount) / (CM.Disp.GetCPS() + CM.Disp.TooltipBonusIncome)) + ')';
			} else l('CMDispTooltipWarnLucky').style.display = 'none';
		}
		else l('CMDispTooltipWarnLucky').style.display = 'none';
		
		if (CM.Options.ToolWarnLuckyFrenzy === 1) {
			let limitLuckyFrenzy = limitLucky * 7;
			if (amount < limitLuckyFrenzy && (CM.Disp.tooltipType != 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
				l('CMDispTooltipWarnLuckyFrenzyText').textContent = Beautify(limitLuckyFrenzy - amount) + ' (' + CM.Disp.FormatTime((limitLuckyFrenzy - amount) / (CM.Disp.GetCPS() + CM.Disp.TooltipBonusIncome)) + ')';
			} else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
		}
		else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';

		if (CM.Options.ToolWarnConjure === 1) {
			let limitConjure = limitLucky * 2;
			if ((amount < limitConjure) && (CM.Disp.tooltipType != 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnConjure').style.display = '';
				l('CMDispTooltipWarnConjureText').textContent = Beautify(limitConjure - amount) + ' (' + CM.Disp.FormatTime((limitConjure - amount) / (CM.Disp.GetCPS() + CM.Disp.TooltipBonusIncome)) + ')';
			} else l('CMDispTooltipWarnConjure').style.display = 'none';
		}
		else l('CMDispTooltipWarnConjure').style.display = 'none';

		if (CM.Options.ToolWarnConjureFrenzy === 1) {
			let limitConjureFrenzy = limitLucky * 2 * 7;
			if ((amount < limitConjureFrenzy) && (CM.Disp.tooltipType != 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnConjureFrenzy').style.display = '';
				l('CMDispTooltipWarnConjureFrenzyText').textContent = Beautify(limitConjureFrenzy - amount) + ' (' + CM.Disp.FormatTime((limitConjureFrenzy - amount) / (CM.Disp.GetCPS() + CM.Disp.TooltipBonusIncome)) + ')';
			} else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';
		}
		else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';

		if (CM.Options.ToolWarnEdifice === 1) {
			if (CM.Cache.Edifice && amount < CM.Cache.Edifice && (CM.Disp.tooltipType != 'b' || Game.buyMode === 1)) {
				l('CMDispTooltipWarnEdifice').style.display = '';
				l('CMDispTooltipWarnEdificeText').textContent = Beautify(CM.Cache.Edifice - amount) + ' (' + CM.Disp.FormatTime((CM.Cache.Edifice - amount) / (CM.Disp.GetCPS() + CM.Disp.TooltipBonusIncome)) + ')';
			} else l('CMDispTooltipWarnEdifice').style.display = 'none';
		}
		else l('CMDispTooltipWarnEdifice').style.display = 'none';
	}
	else {
		if (l('CMDispTooltipWarningParent') != null) {
			l('CMDispTooltipWarningParent').remove();
		}
	}
};

/**
 * This function updates the location of the tooltip
 * It is called by Game.tooltip.update() because of CM.Main.ReplaceNative()
 */
CM.Disp.UpdateTooltipLocation = function() {
	if (Game.tooltip.origin === 'store') {
		let warnOffset = 0;
		if (CM.Options.ToolWarnLucky === 1 && CM.Options.ToolWarnPos === 1 && typeof CM.Disp.TooltipWarn != "undefined") {
			warnOffset = CM.Disp.TooltipWarn.clientHeight - 4;
		}
		Game.tooltip.tta.style.top = Math.min(parseInt(Game.tooltip.tta.style.top), (l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - warnOffset - 46) + 'px';
	}
	// Kept for future possible use if the code changes again
	/*else if (!Game.onCrate && !Game.OnAscend && CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(CM.Disp.TimerBar.style.height)) + 'px';
	}*/
};

/**
 * This function toggles the position of the warnings created by CM.Disp.TooltipCreateWarningSection()
 * It is called by a change in CM.Options.ToolWarnPos 
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
CM.Disp.ToggleToolWarnPos = function() {
	if (typeof CM.Disp.TooltipWarn != "undefined") {
		if (CM.Options.ToolWarnPos === 0) {
			CM.Disp.TooltipWarn.style.top = 'auto';
			CM.Disp.TooltipWarn.style.margin = '4px -4px';
			CM.Disp.TooltipWarn.style.padding = '3px 4px';
		}
		else {
			CM.Disp.TooltipWarn.style.right = 'auto';
			CM.Disp.TooltipWarn.style.margin = '4px';
			CM.Disp.TooltipWarn.style.padding = '4px 3px';
		}
	}
};

/**
 * This function checks and create a tooltip for the wrinklers
 * It is called by CM.Disp.Draw()
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
CM.Disp.CheckWrinklerTooltip = function() {
	if (CM.Options.TooltipWrink === 1 && CM.Disp.TooltipWrinklerArea === 1) { // Latter is set by CM.Main.AddWrinklerAreaDetect
		let showingTooltip = false;
		for (let i of Object.keys(Game.wrinklers)) {
			let me = Game.wrinklers[i];
			if (me.phase > 0 && me.selected) {
				showingTooltip = true;
				if (CM.Disp.TooltipWrinklerBeingShown[i] === 0 || CM.Disp.TooltipWrinklerBeingShown[i] === undefined) {
					let placeholder = document.createElement('div');
					let wrinkler = document.createElement('div');
					wrinkler.style.minWidth = '120px';
					wrinkler.style.marginBottom = '4px';
					let div = document.createElement('div');
					div.style.textAlign = 'center';
					div.id = 'CMTooltipWrinkler';
					wrinkler.appendChild(div);
					placeholder.appendChild(wrinkler);
					Game.tooltip.draw(this, escape(placeholder.innerHTML));
					CM.Disp.TooltipWrinkler = i;
					CM.Disp.TooltipWrinklerBeingShown[i] = 1;
				}
				else break;
			}
			else {
				CM.Disp.TooltipWrinklerBeingShown[i] = 0;
			}
		}
		if (!showingTooltip) {
			Game.tooltip.hide();
		}
	}
};

/**
 * This function updates the amount to be displayed by the wrinkler tooltip created by CM.Disp.CheckWrinklerTooltip()
 * It is called by CM.Disp.Draw()
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
CM.Disp.UpdateWrinklerTooltip = function() {
	if (CM.Options.TooltipWrink === 1 && l('CMTooltipWrinkler') != null) {
		let sucked = Game.wrinklers[CM.Disp.TooltipWrinkler].sucked;
		let toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[CM.Disp.TooltipWrinkler].type === 1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		if (CM.Sim.Objects.Temple.minigameLoaded) {
			let godLvl = Game.hasGod('scorn');
			if (godLvl === 1) sucked *= 1.15;
			else if (godLvl === 2) sucked *= 1.1;
			else if (godLvl === 3) sucked *= 1.05;
		}
		l('CMTooltipWrinkler').textContent = Beautify(sucked);
	}
};

/********
 * Section: Functions related to the Dragon */

/**
 * This functions adds the two extra lines about CPS and time to recover to the aura picker infoscreen
 * It is called by Game.DescribeDragonAura() after CM.Main.ReplaceNative()
 * @param	{number}	aura	The number of the aura currently selected by the mouse/user
 */
CM.Disp.AddAuraInfo = function(aura) {
	if (CM.Options.DragonAuraInfo === 1) {
		let [bonusCPS, priceOfChange] = CM.Sim.CalculateChangeAura(aura);
		let timeToRecover = CM.Disp.FormatTime(priceOfChange / (bonusCPS + Game.cookiesPs));
		let bonusCPSPercentage = CM.Disp.Beautify(bonusCPS / Game.cookiesPs);
		bonusCPS = CM.Disp.Beautify(bonusCPS);

		l('dragonAuraInfo').style.minHeight = "60px";
		l('dragonAuraInfo').style.margin = "8px";
		l('dragonAuraInfo').appendChild(document.createElement("div")).className = "line";
		let div = document.createElement("div");
		div.style.minWidth = "200px";
		div.style.textAlign = "center";
		div.textContent = "Picking this aura will change CPS by " + bonusCPS + " (" + bonusCPSPercentage + "% of current CPS).";
		l('dragonAuraInfo').appendChild(div);
		let div2 = document.createElement("div");
		div2.style.minWidth = "200px";
		div2.style.textAlign = "center";
		div2.textContent = "It will take " + timeToRecover + " to recover the cost.";
		l('dragonAuraInfo').appendChild(div2);
	}
};

/**
 * This functions adds a tooltip to the level up button displaying the cost of rebuying all
 * It is called by Game.ToggleSpecialMenu() after CM.Main.ReplaceNative()
 */
CM.Disp.AddDragonLevelUpTooltip = function() {
	// Check if it is the dragon popup that is on screen
	if ((l('specialPopup').className.match(/onScreen/) && l('specialPopup').children[0].style.background.match(/dragon/)) != null) {
		for (let i = 0; i < l('specialPopup').childNodes.length; i++) {
			if (l('specialPopup').childNodes[i].className === "optionBox") {
				l('specialPopup').children[i].onmouseover = function() {CM.Cache.CacheDragonCost(); Game.tooltip.dynamic = 1; Game.tooltip.draw(l('specialPopup'), `<div style="min-width:200px;text-align:center;">${CM.Cache.CostDragonUpgrade}</div>`, 'this'); Game.tooltip.wobble();};
				l('specialPopup').children[i].onmouseout = function() {Game.tooltip.shouldHide = 1;};
			}
		}
	}
};

/********
 * Section: General functions related to the Options/Stats pages

/**
 * This function adds the calll the functions to add extra info to the stats and options pages
 * It is called by Game.UpdateMenu()
 */
CM.Disp.AddMenu = function() {
	let title = function() {
		let div = document.createElement('div');
		div.className = 'title ' + CM.Disp.colorTextPre + CM.Disp.colorBlue;
		div.textContent = 'Cookie Monster Goodies';
		return div;
	};

	if (Game.onMenu === 'prefs') {
		CM.Disp.AddMenuPref(title);
	}
	else if (Game.onMenu === 'stats') {
		if (CM.Options.Stats) {
			CM.Disp.AddMenuStats(title);
		}
	}
};

/**
 * This function refreshes the stats page, CM.Options.UpStats determines the rate at which that happens
 * It is called by CM.Disp.Draw()
 */
CM.Disp.RefreshMenu = function() {
	if (CM.Options.UpStats && Game.onMenu === 'stats' && (Game.drawT - 1) % (Game.fps * 5) != 0 && (Game.drawT - 1) % Game.fps === 0) Game.UpdateMenu();
};

/********
 * Section: Functions related to the Options/Preferences page

/**
 * This function adds the options/settings of CookieMonster to the options page
 * It is called by CM.Disp.AddMenu
 * @param {function} title	A function that returns the title of CookieMonster pre-styled
 */
CM.Disp.AddMenuPref = function(title) {	
	let frag = document.createDocumentFragment();
	frag.appendChild(title());

	for (let group of Object.keys(CM.Data.ConfigGroups)) {
		let groupObject = CM.Disp.CreatePrefHeader(group, CM.Data.ConfigGroups[group]); // (group, display-name of group)
		frag.appendChild(groupObject);
		if (CM.Options.Header[group]) { // 0 is show, 1 is collapsed
			// Make sub-sections of Notification section
			if (group === "Notification") {
				for (let subGroup of Object.keys(CM.Data.ConfigGroupsNotification)) {
					let subGroupObject = CM.Disp.CreatePrefHeader(subGroup, CM.Data.ConfigGroupsNotification[subGroup]); // (group, display-name of group)
					subGroupObject.style.fontSize = "15px";
					subGroupObject.style.opacity = "0.5";
					frag.appendChild(subGroupObject);
					if (CM.Options.Header[subGroup]) {
						for (let option in CM.Data.Config) {
							if (CM.Data.Config[option].group === subGroup) frag.appendChild(CM.Disp.CreatePrefOption(option));
						}
					}
				}
			} else {
				for (let option of Object.keys(CM.Data.Config)) {
					if (CM.Data.Config[option].group === group) frag.appendChild(CM.Disp.CreatePrefOption(option));
				}
			}
		}
	}
	
	let resDef = document.createElement('div');
	resDef.className = 'listing';
	let resDefBut = document.createElement('a');
	resDefBut.className = 'option';
	resDefBut.onclick = function() {CM.Config.RestoreDefault();};
	resDefBut.textContent = 'Restore Default';
	resDef.appendChild(resDefBut);
	frag.appendChild(resDef);
	
	l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
};

/**
 * This function creates a header-object for the options page
 * It is called by CM.Disp.AddMenuPref()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
CM.Disp.CreatePrefHeader = function(config, text) {
	let div = document.createElement('div');
	div.className = 'title';

	div.style.opacity = '0.7';
	div.style.fontSize = '17px';
	div.appendChild(document.createTextNode(text + ' '));
	let span = document.createElement('span'); // Creates the +/- button
	span.style.cursor = 'pointer';
	span.style.display = 'inline-block';
	span.style.height = '14px';
	span.style.width = '14px';
	span.style.borderRadius = '7px';
	span.style.textAlign = 'center';
	span.style.backgroundColor = '#C0C0C0';
	span.style.color = 'black';
	span.style.fontSize = '13px';
	span.style.verticalAlign = 'middle';
	span.textContent = CM.Options.Header[config] ? '-' : '+';
	span.onclick = function() {CM.Config.ToggleHeader(config); Game.UpdateMenu();};
	div.appendChild(span);
	return div;
};

/**
 * This function creates an option-object for the options page
 * It is called by CM.Disp.AddMenuPref()
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
CM.Disp.CreatePrefOption = function(config) {
	if (CM.Data.Config[config].type === "bool") {
		let div = document.createElement('div');
		div.className = 'listing';
		let a = document.createElement('a');
		if (CM.Data.Config[config].toggle && CM.Options[config] === 0) {
			a.className = 'option off';
		}
		else {
			a.className = 'option';
		}
		a.id = CM.Config.ConfigPrefix + config;
		a.onclick = function() {CM.Config.ToggleConfig(config);};
		a.textContent = CM.Data.Config[config].label[CM.Options[config]];
		div.appendChild(a);
		let label = document.createElement('label');
		label.textContent = CM.Data.Config[config].desc;
		div.appendChild(label);
		return div;
	}
	else if (CM.Data.Config[config].type === "vol") {
		let div = document.createElement('div');
		div.className = 'listing';
		let volume = document.createElement('div');
		volume.className = 'sliderBox';
		let title = document.createElement('div');
		title.style.float = "left";
		title.innerHTML = CM.Data.Config[config].desc;
		volume.appendChild(title);
		let percent = document.createElement('div');
		percent.id = "slider" + config + "right";
		percent.style.float = "right";
		percent.innerHTML = CM.Options[config] + "%";
		volume.appendChild(percent);
		let slider = document.createElement('input');
		slider.className = "slider";
		slider.id = "slider" + config;
		slider.style.clear = "both";
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.step = "1";
		slider.value = CM.Options[config];
		slider.oninput = function() {CM.Config.ToggleConfigVolume(config);};
		slider.onchange = function() {CM.Config.ToggleConfigVolume(config);};
		volume.appendChild(slider);
		div.appendChild(volume);
		return div;
	}
	else if (CM.Data.Config[config].type === "url") {
		let div = document.createElement('div');
		div.className = 'listing';
		let span = document.createElement('span');
		span.className = 'option';
		span.textContent = CM.Data.Config[config].label + ' ';
		div.appendChild(span);
		let input = document.createElement('input');
		input.id = CM.Config.ConfigPrefix + config;
		input.className = 'option';
		input.type = 'text';
		input.readOnly = true;
		input.setAttribute('value', CM.Options[config]);
		input.style.width = '300px';
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		let inputPrompt = document.createElement('input');
		inputPrompt.id = CM.Config.ConfigPrefix + config + 'Prompt';
		inputPrompt.className = 'option';
		inputPrompt.type = 'text';
		inputPrompt.setAttribute('value', CM.Options[config]);
		let a = document.createElement('a');
		a.className = 'option';
		a.onclick = function() {Game.Prompt(inputPrompt.outerHTML, [['Save', 'CM.Options[\'' + config + '\'] = l(CM.Config.ConfigPrefix + \'' + config + '\' + \'Prompt\').value; CM.Config.SaveConfig(); Game.ClosePrompt(); Game.UpdateMenu();'], 'Cancel']);};
		a.textContent = 'Edit';
		div.appendChild(a);
		let label = document.createElement('label');
		label.textContent = CM.Data.Config[config].desc;
		div.appendChild(label);
		return div;
	}
	else if (CM.Data.Config[config].type === "color") {
		let div = document.createElement('div');
		for (let i = 0; i < CM.Disp.colors.length; i++) {
			let innerDiv = document.createElement('div');
			innerDiv.className = 'listing';
			let input = document.createElement('input');
			input.id = CM.Disp.colors[i];
			input.style.width = '65px';
			input.setAttribute('value', CM.Options.Colors[CM.Disp.colors[i]]);
			innerDiv.appendChild(input);
			let change = function() {CM.Options.Colors[this.targetElement.id] = this.toHEXString(); CM.Disp.UpdateColors(); CM.Config.SaveConfig(); Game.UpdateMenu();};
			new JSColor(input, {hash: true, position: "right", onInput: change});
			let label = document.createElement('label');
			label.textContent = CM.Data.Config.Colors.desc[CM.Disp.colors[i]];
			innerDiv.appendChild(label);
			div.appendChild(innerDiv);
		}
		return div;
	}
	else if (CM.Data.Config[config].type === "numscale") {
		let div = document.createElement('div');
		div.className = 'listing';
		let span = document.createElement('span');
		span.className = 'option';
		span.textContent = CM.Data.Config[config].label + ' ';
		div.appendChild(span);
		let input = document.createElement('input');
		input.id = CM.Config.ConfigPrefix + config;
		input.className = 'option';
		input.type = 'number';
		input.value = (CM.Options[config]);
		input.min = CM.Data.Config[config].min;
		input.max = CM.Data.Config[config].max;
		input.oninput = function() {if (this.value > this.max) console.log("TEST");
			CM.Options[config] = this.value; 
			CM.Config.SaveConfig(); 
			CM.Disp.RefreshScale();
		};
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		let label = document.createElement('label');
		label.textContent = CM.Data.Config[config].desc;
		div.appendChild(label);
		return div;
	}
};

/**
 * This function changes some of the time-displays in the game to be more detailed
 * It is called by a change in CM.Options.DetailedTime
 */
CM.Disp.ToggleDetailedTime = function() {
	if (CM.Options.DetailedTime === 1) Game.sayTime = CM.Disp.sayTime;
	else Game.sayTime = CM.Backup.sayTime;
};

/**
 * This function refreshes all numbers after a change in scale-setting
 * It is therefore called by a changes in CM.Options.Scale, CM.Options.ScaleDecimals, CM.Options.ScaleSeparator and CM.Options.ScaleCutoff 
 */
CM.Disp.RefreshScale = function() {
	BeautifyAll();
	Game.RefreshStore();
	Game.RebuildUpgrades();

	CM.Disp.UpdateBotBar();
	CM.Disp.UpdateBuildings();
	CM.Disp.UpdateUpgrades();
};

/**
 * This function changes/refreshes colours if the user has set new standard colours
 * The function is therefore called by a change in CM.Options.Colors
 */
CM.Disp.UpdateColors = function() {
	let str = '';
	for (let i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorTextPre + CM.Disp.colors[i] + ' { color: ' + CM.Options.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	for (let i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorBackPre + CM.Disp.colors[i] + ' { background-color: ' + CM.Options.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	for (let i = 0; i < CM.Disp.colors.length; i++) {
		str += '.' + CM.Disp.colorBorderPre + CM.Disp.colors[i] + ' { border: 1px solid ' + CM.Options.Colors[CM.Disp.colors[i]] + '; }\n';
	}
	CM.Disp.Css.textContent = str;
	CM.Disp.UpdateBuildings(); // Class has been already set
};

/********
 * Section: Functions related to the Stats page

/**
 * This function adds stats created by CookieMonster to the stats page
 * It is called by CM.Disp.AddMenu
 * @param {function} title	A function that returns the title of CookieMonster pre-styled
 */
CM.Disp.AddMenuStats = function(title) {
	let stats = document.createElement('div');
	stats.className = 'subsection';
	stats.appendChild(title());

	stats.appendChild(CM.Disp.CreateStatsHeader('Lucky Cookies', 'Lucky'));
	if (CM.Options.Header.Lucky) {
		stats.appendChild(CM.Disp.CreateStatsLuckySection());
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Chain Cookies', 'Chain'));
	if (CM.Options.Header.Chain) {
		stats.appendChild(CM.Disp.CreateStatsChainSection());
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Spells', 'Spells'));
	if (CM.Options.Header.Spells) {
		stats.appendChild(CM.Disp.CreateStatsSpellsSection());
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Prestige', 'Prestige'));
	if (CM.Options.Header.Prestige) {
		stats.appendChild(CM.Disp.CreateStatsPrestigeSection());
	}

	if (Game.cpsSucked > 0) {
		stats.appendChild(CM.Disp.CreateStatsHeader('Wrinklers', 'Wrink'));
		if (CM.Options.Header.Wrink) {
			let popAllFrag = document.createDocumentFragment();
			popAllFrag.appendChild(document.createTextNode(Beautify(CM.Cache.WrinklersTotal) + ' / ' + Beautify(CM.Cache.WrinklersNormal) + ' '));
			let popAllA = document.createElement('a');
			popAllA.textContent = 'Pop All Normal';
			popAllA.className = 'option';
			popAllA.onclick = function() { CM.Disp.PopAllNormalWrinklers(); };
			popAllFrag.appendChild(popAllA);
			stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Rewards of Popping (All/Normal)',  popAllFrag));
			let popFattestFrag = document.createDocumentFragment();
			popFattestFrag.appendChild(document.createTextNode(Beautify(CM.Cache.WrinklersFattest[0]) + ' '));
			let popFattestA = document.createElement('a');
			popFattestA.textContent = 'Pop Single Fattest';
			popFattestA.className = 'option';
			popFattestA.onclick = function() {if (CM.Cache.WrinklersFattest[1]) Game.wrinklers[CM.Cache.WrinklersFattest[1]].hp = 0; };
			popFattestFrag.appendChild(popFattestA);
			stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Rewards of Popping Single Fattest Non-Shiny Wrinkler (id: ' + (CM.Cache.WrinklersFattest[1] ? CM.Cache.WrinklersFattest[1] : "None") + ")",  popFattestFrag));
		}
	}


	let specDisp = false;
	let missingHalloweenCookies = [];
	for (let i of Object.keys(CM.Data.HalloCookies)) {
		if (!Game.Has(CM.Data.HalloCookies[i])) {
			missingHalloweenCookies.push(CM.Data.HalloCookies[i]);
			specDisp = true;
		}
	}
	let missingChristmasCookies = [];
	for (let i of Object.keys(CM.Data.ChristCookies)) {
		if (!Game.Has(CM.Data.ChristCookies[i])) {
			missingChristmasCookies.push(CM.Data.ChristCookies[i]);
			specDisp = true;
		}
	}
	let missingValentineCookies = [];
	for (let i of Object.keys(CM.Data.ValCookies)) {
		if (!Game.Has(CM.Data.ValCookies[i])) {
			missingValentineCookies.push(CM.Data.ValCookies[i]);
			specDisp = true;
		}
	}
	let missingNormalEggs = [];
	for (let i of Object.keys(Game.eggDrops)) {
		if (!Game.HasUnlocked(Game.eggDrops[i])) {
			missingNormalEggs.push(Game.eggDrops[i]);
			specDisp = true;
		}
	}
	let missingRareEggs = [];
	for (let i of Object.keys(Game.rareEggDrops)) {
		if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
			missingRareEggs.push(Game.rareEggDrops[i]);
			specDisp = true;
		}
	}
	let missingPlantDrops = [];
	for (let i of Object.keys(CM.Data.PlantDrops)) {
		if (!Game.HasUnlocked(CM.Data.PlantDrops[i])) {
			missingPlantDrops.push(CM.Data.PlantDrops[i]);
			specDisp = true;
		}
	}
	let choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg'));
	let centEgg = Game.Has('Century egg');
	
	if (Game.season === 'christmas' || specDisp || choEgg || centEgg) {
		stats.appendChild(CM.Disp.CreateStatsHeader('Season Specials', 'Sea'));
		if (CM.Options.Header.Sea) {
			if (missingHalloweenCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Halloween Cookies Left to Buy', CM.Disp.CreateStatsMissDisp(missingHalloweenCookies)));
			if (missingChristmasCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Christmas Cookies Left to Buy',  CM.Disp.CreateStatsMissDisp(missingChristmasCookies)));
			if (missingValentineCookies.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Valentine Cookies Left to Buy',  CM.Disp.CreateStatsMissDisp(missingValentineCookies)));
			if (missingNormalEggs.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Normal Easter Eggs Left to Unlock',  CM.Disp.CreateStatsMissDisp(missingNormalEggs)));
			if (missingRareEggs.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Rare Easter Eggs Left to Unlock',  CM.Disp.CreateStatsMissDisp(missingRareEggs)));
			if (missingPlantDrops.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Rare Plant Drops Left to Unlock',  CM.Disp.CreateStatsMissDisp(missingPlantDrops)));

			if (Game.season === 'christmas') stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Reindeer Reward',  document.createTextNode(Beautify(CM.Cache.SeaSpec))));
			if (choEgg) {
				stats.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Chocolate Egg Cookies', document.createTextNode(Beautify(CM.Cache.lastChoEgg)), 'ChoEggTooltipPlaceholder'));
			}
			if (centEgg) {
				stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Century Egg Multiplier', document.createTextNode((Math.round((CM.Cache.CentEgg - 1) * 10000) / 100) + '%')));
			}
		}
	}

	stats.appendChild(CM.Disp.CreateStatsHeader('Miscellaneous', 'Misc'));
	if (CM.Options.Header.Misc) {
		stats.appendChild(CM.Disp.CreateStatsListing("basic", 
			'Average Cookies Per Second (Past ' + (CM.Disp.cookieTimes[CM.Options.AvgCPSHist] < 60 ? (CM.Disp.cookieTimes[CM.Options.AvgCPSHist] + ' seconds') : ((CM.Disp.cookieTimes[CM.Options.AvgCPSHist] / 60) + (CM.Options.AvgCPSHist === 3 ? ' minute' : ' minutes'))) + ')', 
			document.createTextNode(Beautify(CM.Cache.AvgCPS, 3))
		));
		stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Average Cookie Clicks Per Second (Past ' + CM.Disp.clickTimes[CM.Options.AvgClicksHist] + (CM.Options.AvgClicksHist === 0 ? ' second' : ' seconds') + ')', document.createTextNode(Beautify(CM.Cache.AverageClicks, 1))));
		if (Game.Has('Fortune cookies')) {
			let fortunes = [];
			for (let i of Object.keys(CM.Data.Fortunes)) {
				if (!Game.Has(CM.Data.Fortunes[i])) {
					fortunes.push(CM.Data.Fortunes[i]);
				}
			}
			if (fortunes.length != 0) stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Fortune Upgrades Left to Buy',  CM.Disp.CreateStatsMissDisp(fortunes)));
		}
		if (CM.Options.ShowMissedGC) {
			stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Missed Golden Cookies', document.createTextNode(Beautify(Game.missedGoldenClicks))));
		}
		if (Game.prefs.autosave) {
			let timer = document.createElement('span');
			timer.id = 'CMStatsAutosaveTimer';
			timer.innerText = Game.sayTime(Game.fps * 60 - (Game.OnAscend ? 0 : (Game.T % (Game.fps * 60))), 4);
			stats.appendChild(CM.Disp.CreateStatsListing("basic", 'Time till autosave', timer));
		}
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);

	if (CM.Options.MissingUpgrades) {
		CM.Disp.AddMissingUpgrades();
	}
};

/**
 * This function creates a header-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
CM.Disp.CreateStatsHeader = function(text, config) {
	let div = document.createElement('div');
	div.className = 'title';
	div.style.padding = '5px 16px';
	div.style.opacity = '0.7';
	div.style.fontSize = '17px';
	div.style.fontFamily = '"Kavoon", Georgia, serif';
	div.appendChild(document.createTextNode(text + ' '));
	let span = document.createElement('span');
	span.style.cursor = 'pointer';
	span.style.display = 'inline-block';
	span.style.height = '14px';
	span.style.width = '14px';
	span.style.borderRadius = '7px';
	span.style.textAlign = 'center';
	span.style.backgroundColor = '#C0C0C0';
	span.style.color = 'black';
	span.style.fontSize = '13px';
	span.style.verticalAlign = 'middle';
	span.textContent = CM.Options.Header[config] ? '-' : '+';
	span.onclick = function() {CM.Config.ToggleHeader(config); Game.UpdateMenu();};
	div.appendChild(span);
	return div;
};

/**
 * This function creates an stats-listing-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		type		The type fo the listing
 * @param 	{string}		name		The name of the option
 * @param 	{object}		text		The text-object of the option
 * @param 	{string}		placeholder	The id of the to-be displayed tooltip if applicable
 * @returns	{object}		div			The option object
 */
CM.Disp.CreateStatsListing = function(type, name, text, placeholder) {
	let div = document.createElement('div');
	div.className = 'listing';

	let listingName = document.createElement('b');
	listingName.textContent = name;
	div.appendChild(listingName);
	if (type === "withTooltip")  {
		div.className = 'listing';
		div.appendChild(document.createTextNode(' '));

		let tooltip = document.createElement('span');
		tooltip.onmouseout = function() { Game.tooltip.hide(); };
		tooltip.onmouseover = function() {Game.tooltip.draw(this, escape(CM.Disp[placeholder].innerHTML));};
		tooltip.style.cursor = 'default';
		tooltip.style.display = 'inline-block';
		tooltip.style.height = '10px';
		tooltip.style.width = '10px';
		tooltip.style.borderRadius = '5px';
		tooltip.style.textAlign = 'center';
		tooltip.style.backgroundColor = '#C0C0C0';
		tooltip.style.color = 'black';
		tooltip.style.fontSize = '9px';
		tooltip.style.verticalAlign = 'bottom';
		tooltip.textContent = '?';
		div.appendChild(tooltip);
	}
	div.appendChild(document.createTextNode(': '));
	div.appendChild(text);
	return div;
};

/**
 * This function creates a tooltip containing all missing holiday items contained in the list theMissDisp
 * @param 	{list}			theMissDisp		A list of the missing holiday items
 * @returns	{object}		frag			The tooltip object
 */
CM.Disp.CreateStatsMissDisp = function(theMissDisp) {
	let frag = document.createDocumentFragment();
	frag.appendChild(document.createTextNode(theMissDisp.length + ' '));
	let span = document.createElement('span');
	span.onmouseout = function() { Game.tooltip.hide(); };
	let placeholder = document.createElement('div');
	let missing = document.createElement('div');
	missing.style.minWidth = '140px';
	missing.style.marginBottom = '4px';
	let title = document.createElement('div');
	title.className = 'name';
	title.style.marginBottom = '4px';
	title.style.textAlign = 'center';
	title.textContent = 'Missing';
	missing.appendChild(title);
	for (let i of Object.keys(theMissDisp)) {
		let div = document.createElement('div');
		div.style.textAlign = 'center';
		div.appendChild(document.createTextNode(theMissDisp[i]));
		missing.appendChild(div);
	}
	placeholder.appendChild(missing);
	span.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML));};
	span.style.cursor = 'default';
	span.style.display = 'inline-block';
	span.style.height = '10px';
	span.style.width = '10px';
	span.style.borderRadius = '5px';
	span.style.textAlign = 'center';
	span.style.backgroundColor = '#C0C0C0';
	span.style.color = 'black';
	span.style.fontSize = '9px';
	span.style.verticalAlign = 'bottom';
	span.textContent = '?';
	frag.appendChild(span);
	return frag;
};

/**
 * This function creates the "Lucky" section of the stats page
 * @returns	{object}	section		The object contating the Lucky section
 */
CM.Disp.CreateStatsLuckySection = function() {	
	// This sets which tooltip to display for certain stats
	let goldCookTooltip = Game.auraMult('Dragon\'s Fortune') ? 'GoldCookDragonsFortuneTooltipPlaceholder' : 'GoldCookTooltipPlaceholder';
	
	let section = document.createElement('div');
	section.className = 'CMStatsLuckySection';
	
	let luckyColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	let luckyTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Lucky) ? CM.Disp.FormatTime((CM.Cache.Lucky - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	let luckyReqFrag = document.createDocumentFragment();
	let luckyReqSpan = document.createElement('span');
	luckyReqSpan.style.fontWeight = 'bold';
	luckyReqSpan.className = CM.Disp.colorTextPre + luckyColor;
	luckyReqSpan.textContent = Beautify(CM.Cache.Lucky);
	luckyReqFrag.appendChild(luckyReqSpan);
	if (luckyTime != '') {
		let luckyReqSmall = document.createElement('small');
		luckyReqSmall.textContent = ' (' + luckyTime + ')';
		luckyReqFrag.appendChild(luckyReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Lucky!" Cookies Required', luckyReqFrag, goldCookTooltip));


	let luckyColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	let luckyTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.LuckyFrenzy) ? CM.Disp.FormatTime((CM.Cache.LuckyFrenzy - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	let luckyReqFrenFrag = document.createDocumentFragment();
	let luckyReqFrenSpan = document.createElement('span');
	luckyReqFrenSpan.style.fontWeight = 'bold';
	luckyReqFrenSpan.className = CM.Disp.colorTextPre + luckyColorFrenzy;
	luckyReqFrenSpan.textContent = Beautify(CM.Cache.LuckyFrenzy);
	luckyReqFrenFrag.appendChild(luckyReqFrenSpan);
	if (luckyTimeFrenzy != '') {
		let luckyReqFrenSmall = document.createElement('small');
		luckyReqFrenSmall.textContent = ' (' + luckyTimeFrenzy + ')';
		luckyReqFrenFrag.appendChild(luckyReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Lucky!" Cookies Required (Frenzy)', luckyReqFrenFrag, goldCookTooltip));
	
	let luckySplit = CM.Cache.LuckyReward != CM.Cache.LuckyWrathReward;

	let luckyRewardMaxSpan = document.createElement('span');
	luckyRewardMaxSpan.style.fontWeight = 'bold';
	luckyRewardMaxSpan.className = CM.Disp.colorTextPre + CM.Cache.LuckyReward;
	luckyRewardMaxSpan.textContent = Beautify(CM.Cache.LuckyReward) + (luckySplit ? (' / ' + Beautify(CM.Cache.LuckyWrathReward)) : '');
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Lucky!" Reward (MAX)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyRewardMaxSpan, goldCookTooltip));

	let luckyRewardFrenzyMaxSpan = document.createElement('span');
	luckyRewardFrenzyMaxSpan.style.fontWeight = 'bold';
	luckyRewardFrenzyMaxSpan.className = CM.Disp.colorTextPre + luckyRewardFrenzyMaxSpan;
	luckyRewardFrenzyMaxSpan.textContent = Beautify(CM.Cache.LuckyRewardFrenzy) + (luckySplit ? (' / ' + Beautify(CM.Cache.LuckyWrathRewardFrenzy)) : '');
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Lucky!" Reward (MAX) (Frenzy)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyRewardFrenzyMaxSpan , goldCookTooltip));
	
	let luckyCurBase = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * CM.Cache.DragonsFortuneMultAdjustment * 60 * 15) + 13;
	let luckyCurSpan = document.createElement('span');
	luckyCurSpan.style.fontWeight = 'bold';
	luckyCurSpan.className = CM.Disp.colorTextPre + luckyCurSpan;
	luckyCurSpan.textContent = Beautify(CM.Cache.GoldenCookiesMult * luckyCurBase) + (luckySplit ? (' / ' + Beautify(CM.Cache.WrathCookiesMult * luckyCurBase)) : '');
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Lucky!" Reward (CUR)' + (luckySplit ? ' (Golden / Wrath)' : ''), luckyCurSpan, goldCookTooltip));
	return section;
};

/**
 * This function creates the "Chain" section of the stats page
 * @returns	{object}	section		The object contating the Chain section
 */
CM.Disp.CreateStatsChainSection = function() {
	// This sets which tooltip to display for certain stats
	let goldCookTooltip = Game.auraMult('Dragon\'s Fortune') ? 'GoldCookDragonsFortuneTooltipPlaceholder' : 'GoldCookTooltipPlaceholder';
	
	let section = document.createElement('div');
	section.className = 'CMStatsChainSection';

	let chainColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainRequired) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	let chainTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainRequired) ? CM.Disp.FormatTime((CM.Cache.ChainRequired - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	let chainReqFrag = document.createDocumentFragment();
	let chainReqSpan = document.createElement('span');
	chainReqSpan.style.fontWeight = 'bold';
	chainReqSpan.className = CM.Disp.colorTextPre + chainColor;
	chainReqSpan.textContent = Beautify(CM.Cache.ChainRequired);
	chainReqFrag.appendChild(chainReqSpan);
	if (chainTime != '') {
		let chainReqSmall = document.createElement('small');
		chainReqSmall.textContent = ' (' + chainTime + ')';
		chainReqFrag.appendChild(chainReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Chain" Cookies Required', chainReqFrag, goldCookTooltip));
	
	let chainWrathColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrathRequired) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	let chainWrathTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainWrathRequired) ? CM.Disp.FormatTime((CM.Cache.ChainWrathRequired - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	let chainWrathReqFrag = document.createDocumentFragment();
	let chainWrathReqSpan = document.createElement('span');
	chainWrathReqSpan.style.fontWeight = 'bold';
	chainWrathReqSpan.className = CM.Disp.colorTextPre + chainWrathColor;
	chainWrathReqSpan.textContent = Beautify(CM.Cache.ChainWrathRequired);
	chainWrathReqFrag.appendChild(chainWrathReqSpan);
	if (chainWrathTime != '') {
		let chainWrathReqSmall = document.createElement('small');
		chainWrathReqSmall.textContent = ' (' + chainWrathTime + ')';
		chainWrathReqFrag.appendChild(chainWrathReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Chain" Cookies Required (Wrath)', chainWrathReqFrag, goldCookTooltip));
	
	let chainColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyRequired) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	let chainTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyRequired) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzyRequired - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	let chainReqFrenFrag = document.createDocumentFragment();
	let chainReqFrenSpan = document.createElement('span');
	chainReqFrenSpan.style.fontWeight = 'bold';
	chainReqFrenSpan.className = CM.Disp.colorTextPre + chainColorFrenzy;
	chainReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzyRequired);
	chainReqFrenFrag.appendChild(chainReqFrenSpan);
	if (chainTimeFrenzy != '') {
		let chainReqFrenSmall = document.createElement('small');
		chainReqFrenSmall.textContent = ' (' + chainTimeFrenzy + ')';
		chainReqFrenFrag.appendChild(chainReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Chain" Cookies Required (Frenzy)', chainReqFrenFrag, goldCookTooltip));
	
	let chainWrathColorFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrathRequired) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	let chainWrathTimeFrenzy = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.ChainFrenzyWrathRequired) ? CM.Disp.FormatTime((CM.Cache.ChainFrenzyWrathRequired - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	let chainWrathReqFrenFrag = document.createDocumentFragment();
	let chainWrathReqFrenSpan = document.createElement('span');
	chainWrathReqFrenSpan.style.fontWeight = 'bold';
	chainWrathReqFrenSpan.className = CM.Disp.colorTextPre + chainWrathColorFrenzy;
	chainWrathReqFrenSpan.textContent = Beautify(CM.Cache.ChainFrenzyWrathRequired);
	chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSpan);
	if (chainWrathTimeFrenzy != '') {
		let chainWrathReqFrenSmall = document.createElement('small');
		chainWrathReqFrenSmall.textContent = ' (' + chainWrathTimeFrenzy + ')';
		chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Chain" Cookies Required (Frenzy) (Wrath)', chainWrathReqFrenFrag, goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Chain" Reward (MAX) (Golden / Wrath)', document.createTextNode(Beautify(CM.Cache.ChainReward[0]) + ' / ' + Beautify(CM.Cache.ChainWrathReward[0])), goldCookTooltip));

	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Chain" Reward (MAX) (Frenzy) (Golden / Wrath)', document.createTextNode((Beautify(CM.Cache.ChainFrenzyReward[0]) + ' / ' + Beautify(CM.Cache.ChainFrenzyWrathReward[0]))), goldCookTooltip));

	let chainCurMax = Math.min(CM.Cache.NoGoldSwitchCookiesPS * CM.Cache.DragonsFortuneMultAdjustment * 60 * 60 * 6, (Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.5);
	let chainCur = CM.Cache.MaxChainCookieReward(7, chainCurMax, CM.Cache.GoldenCookiesMult)[0];
	let chainCurWrath = CM.Cache.MaxChainCookieReward(6, chainCurMax, CM.Cache.WrathCookiesMult)[0];
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Chain" Reward (CUR) (Golden / Wrath)', document.createTextNode((Beautify(chainCur) + ' / ' + Beautify(chainCurWrath))), goldCookTooltip));
	return section;
};

/**
 * This function creates the "Spells" section of the stats page
 * @returns	{object}	section		The object contating the Spells section
 */
CM.Disp.CreateStatsSpellsSection = function() {
	let section = document.createElement('div');
	section.className = 'CMStatsSpellsSection';

	let conjureColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	let conjureTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure) ? CM.Disp.FormatTime((CM.Cache.Conjure - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	
	let conjureReqFrag = document.createDocumentFragment();
	let conjureReqSpan = document.createElement('span');
	conjureReqSpan.style.fontWeight = 'bold';
	conjureReqSpan.className = CM.Disp.colorTextPre + conjureColor;
	conjureReqSpan.textContent = Beautify(CM.Cache.Conjure);
	conjureReqFrag.appendChild(conjureReqSpan);
	if (conjureTime != '') {
		let conjureReqSmall = document.createElement('small');
		conjureReqSmall.textContent = ' (' + conjureTime + ')';
		conjureReqFrag.appendChild(conjureReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Conjure Baked Goods" Cookies Required', conjureReqFrag, 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Conjure Baked Goods" Reward (MAX)', document.createTextNode(CM.Disp.Beautify(CM.Cache.ConjureReward)), 'GoldCookTooltipPlaceholder'));
	
	let conjureFrenzyColor = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure * 7) ? CM.Disp.colorRed : CM.Disp.colorGreen;
	let conjureFrenzyCur = Math.min((Game.cookies + CM.Disp.GetWrinkConfigBank()) * 0.15, CM.Cache.NoGoldSwitchCookiesPS * 60 * 30);
	let conjureFrenzyTime = ((Game.cookies + CM.Disp.GetWrinkConfigBank()) < CM.Cache.Conjure * 7) ? CM.Disp.FormatTime((CM.Cache.Conjure * 7 - (Game.cookies + CM.Disp.GetWrinkConfigBank())) / CM.Disp.GetCPS()) : '';
	
	let conjureFrenzyReqFrag = document.createDocumentFragment();
	let conjureFrenzyReqSpan = document.createElement('span');
	conjureFrenzyReqSpan.style.fontWeight = 'bold';
	conjureFrenzyReqSpan.className = CM.Disp.colorTextPre + conjureFrenzyColor;
	conjureFrenzyReqSpan.textContent = Beautify(CM.Cache.Conjure * 7);
	conjureFrenzyReqFrag.appendChild(conjureFrenzyReqSpan);
	if (conjureFrenzyTime != '') {
		let conjureFrenzyReqSmall = document.createElement('small');
		conjureFrenzyReqSmall.textContent = ' (' + conjureFrenzyTime + ')';
		conjureFrenzyReqFrag.appendChild(conjureFrenzyReqSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Conjure Baked Goods" Cookies Required (Frenzy)', conjureFrenzyReqFrag, 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Conjure Baked Goods" Reward (MAX) (Frenzy)', document.createTextNode(CM.Disp.Beautify(CM.Cache.ConjureReward * 7)), 'GoldCookTooltipPlaceholder'));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Conjure Baked Goods" Reward (CUR)', document.createTextNode(CM.Disp.Beautify(conjureFrenzyCur)), 'GoldCookTooltipPlaceholder'));
	if (CM.Cache.Edifice) {
		section.appendChild(CM.Disp.CreateStatsListing("withTooltip", '"Spontaneous Edifice" Cookies Required (most expensive building)', document.createTextNode(CM.Disp.Beautify(CM.Cache.Edifice) + ' (' + CM.Cache.EdificeBuilding + ")"), 'GoldCookTooltipPlaceholder'));
	}
	return section;
};

/**
 * This function creates the "Prestige" section of the stats page
 * @returns	{object}	section		The object contating the Prestige section
 */
CM.Disp.CreateStatsPrestigeSection = function() {
	let section = document.createElement('div');
	section.className = 'CMStatsPrestigeSection';

	let possiblePresMax = Math.floor(Game.HowMuchPrestige(CM.Cache.RealCookiesEarned + 
		Game.cookiesReset + CM.Cache.WrinklersTotal + 
		(Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CM.Cache.lastChoEgg : 0)));
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Prestige Level (CUR / MAX)', document.createTextNode(Beautify(Game.prestige) + ' / ' + Beautify(possiblePresMax)), 'PrestMaxTooltipPlaceholder'));
	
	let neededCook = Game.HowManyCookiesReset(possiblePresMax + 1) - (CM.Cache.RealCookiesEarned + Game.cookiesReset + CM.Cache.WrinklersTotal + ((Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CM.Cache.lastChoEgg : 0) ? CM.Cache.lastChoEgg : 0));
	let cookiesNextFrag = document.createDocumentFragment();
	cookiesNextFrag.appendChild(document.createTextNode(Beautify(neededCook)));
	let cookiesNextSmall = document.createElement('small');
	cookiesNextSmall.textContent = ' (' + (CM.Disp.FormatTime(neededCook / CM.Cache.AvgCPSWithChoEgg, 1)) + ')';
	cookiesNextFrag.appendChild(cookiesNextSmall);
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Cookies To Next Level', cookiesNextFrag, 'NextPrestTooltipPlaceholder'));
	
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Heavenly Chips (CUR / MAX)', document.createTextNode(Beautify(Game.heavenlyChips) + ' / ' + Beautify((possiblePresMax - Game.prestige) + Game.heavenlyChips)), 'HeavenChipMaxTooltipPlaceholder'));

	section.appendChild(CM.Disp.CreateStatsListing("basic", 'Heavenly Chips Per Second (last 5 seconds)', document.createTextNode(Beautify(CM.Cache.HCPerSecond, 2))));
	
	let HCTarget = Number(CM.Options.HeavenlyChipsTarget)
	if (!isNaN(HCTarget)) {
		let CookiesTillTarget = HCTarget - Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned))
		if (CookiesTillTarget > 0) {
			section.appendChild(CM.Disp.CreateStatsListing("basic", 'Heavenly Chips To Target Set In Settings (CUR)', document.createTextNode(Beautify(CookiesTillTarget))));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Time To Target (CUR, Current 5 Second Average)', document.createTextNode(CM.Disp.FormatTime(CookiesTillTarget / CM.Cache.HCPerSecond))));
		}
	}

	let resetBonus = CM.Sim.ResetBonus(possiblePresMax);
	let resetFrag = document.createDocumentFragment();
	resetFrag.appendChild(document.createTextNode(Beautify(resetBonus)));
	let increase = Math.round(resetBonus / Game.cookiesPs * 10000);
	if (isFinite(increase) && increase != 0) {
		let resetSmall = document.createElement('small');
		resetSmall.textContent = ' (' + (increase / 100) + '% of income)';
		resetFrag.appendChild(resetSmall);
	}
	section.appendChild(CM.Disp.CreateStatsListing("withTooltip", 'Reset Bonus Income', resetFrag, 'ResetTooltipPlaceholder'));

	let currentPrestige = Math.floor(Game.HowMuchPrestige(Game.cookiesReset));
	let willHave = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
	let willGet = willHave - currentPrestige;
	if (!Game.Has('Lucky digit')) {
		let delta7 = 7 - (willHave % 10);
		if (delta7 < 0) delta7 += 10;
		let next7Reset = willGet + delta7;
		let next7Total = willHave + delta7;
		let frag7 = document.createDocumentFragment();
		frag7.appendChild(document.createTextNode(next7Total.toLocaleString() + " / " + next7Reset.toLocaleString() + " (+" + delta7 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Digit" (total / reset)', frag7));
	}
	
	if (!Game.Has('Lucky number')) {
		let delta777 = 777 - (willHave % 1000);
		if (delta777 < 0) delta777 += 1000;
		let next777Reset = willGet + delta777;
		let next777Total = willHave + delta777;
		let frag777 = document.createDocumentFragment();
		frag777.appendChild(document.createTextNode(next777Total.toLocaleString() + " / " + next777Reset.toLocaleString() + " (+" + delta777 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Number" (total / reset)', frag777));
	}
	
	if (!Game.Has('Lucky payout')) {
		let delta777777 = 777777 - (willHave % 1000000);
		if (delta777777 < 0) delta777777 += 1000000;
		let next777777Reset = willGet + delta777777;
		let next777777Total = willHave + delta777777;
		let frag777777 = document.createDocumentFragment();
		frag777777.appendChild(document.createTextNode(next777777Total.toLocaleString() + " / " + next777777Reset.toLocaleString() + " (+" + delta777777 + ")"));
		section.appendChild(CM.Disp.CreateStatsListing("basic", 'Next "Lucky Payout" (total / reset)', frag777777));
	}

	return section;
};

/**
 * This function creates the missing upgrades sections for prestige, normal and cookie upgrades
 * It is called by CM.Disp.AddMenuStats() when CM.Options.MissingUpgrades is set
 */
CM.Disp.AddMissingUpgrades = function() {
	for (let menuSection of (l('menu').children)) {
		if (menuSection.children[0]) {
			if (menuSection.children[0].innerHTML === "Prestige" && CM.Cache.MissingUpgradesPrestige) {
				let prestigeUpgradesMissing = CM.Cache.MissingUpgradesPrestige.match(new RegExp("div", "g") || []).length / 2;
				let title = document.createElement('div');
				title.id = "CMMissingUpgradesPrestigeTitle";
				title.className = "listing";
				let titlefrag = document.createElement('div');
				titlefrag.innerHTML = '<b>Missing Prestige upgrades:</b> '+ prestigeUpgradesMissing + '/' + Game.PrestigeUpgrades.length + ' (' + Math.floor((prestigeUpgradesMissing / Game.PrestigeUpgrades.length) * 100) + '%)';
				title.appendChild(titlefrag);
				menuSection.appendChild(title);
				let upgrades = document.createElement('div');
				upgrades.className = "listing crateBox";
				upgrades.innerHTML = CM.Cache.MissingUpgradesPrestige;
				menuSection.appendChild(upgrades);
			}
			else if (menuSection.children[0].innerHTML === "Upgrades") {
				if (CM.Cache.MissingUpgrades) {
					let normalUpgradesMissing = CM.Cache.MissingUpgrades.match(new RegExp("div", "g") || []).length / 2;
					let title = document.createElement('div');
					title.id = "CMMissingUpgradesTitle";
					title.className = "listing";
					let titlefrag = document.createElement('div');
					titlefrag.innerHTML = '<b>Missing normal upgrades:</b> '+ normalUpgradesMissing + '/' + (Game.UpgradesByPool[""].length + Game.UpgradesByPool.tech.length) + ' (' + Math.floor((normalUpgradesMissing / ( Game.UpgradesByPool[""].length + Game.UpgradesByPool.tech.length)) * 100) + '%)';
					title.appendChild(titlefrag);
					menuSection.insertBefore(title, menuSection.childNodes[3]);
					let upgrades = document.createElement('div');
					upgrades.className = "listing crateBox";
					upgrades.innerHTML = CM.Cache.MissingUpgrades;
					menuSection.insertBefore(upgrades, document.getElementById("CMMissingUpgradesTitle").nextSibling);
				}
				if (CM.Cache.MissingUpgradesCookies) {
					let cookieUpgradesMissing = CM.Cache.MissingUpgradesCookies.match(new RegExp("div", "g") || []).length / 2;
					let title = document.createElement('div');
					title.id = "CMMissingUpgradesCookiesTitle";
					title.className = "listing";
					let titlefrag = document.createElement('div');
					titlefrag.innerHTML = '<b>Missing Cookie upgrades:</b> '+ cookieUpgradesMissing + '/' + Game.UpgradesByPool.cookie.length + ' (' + Math.floor((cookieUpgradesMissing / Game.UpgradesByPool.cookie.length) * 100) + '%)';
					title.appendChild(titlefrag);
					menuSection.appendChild(title);
					let upgrades = document.createElement('div');
					upgrades.className = "listing crateBox";
					upgrades.innerHTML = CM.Cache.MissingUpgradesCookies;
					menuSection.appendChild(upgrades);
				}
			}
		}
	}
};

/**
 * This function returns the "crates" (icons) for missing upgrades in the stats sections
 * It returns a html string that gets appended to the respective CM.Cache.MissingUpgrades-variable by CM.Cache.CacheMissingUpgrades()
 * It is also called by CM.Cache.CacheMissingUpgrades() for every non bought upgrade
 * @param	{object}	me	The upgrade object
 * @returns	{string}	?	The HTML string that creates the icon.
 */
CM.Disp.crateMissing = function(me) {
	let classes = 'crate upgrade missing';
	if (me.pool === 'prestige') classes+=' heavenly';
	
	let noFrame = 0;
	if (!Game.prefs.crates) noFrame = 1;
	if (noFrame) classes += ' noFrame';
	
	let icon = me.icon;
	if (me.iconFunction) icon = me.iconFunction();
	let tooltip = `function() {return Game.crateTooltip(Game.UpgradesById[${me.id}], 'stats');}`;
	return `<div class="${classes}"
	${Game.getDynamicTooltip(tooltip, 'top', true)}
	style = "${((icon[2] ? 'background-image: url(' + icon[2] + ');' : '') + 'background-position:' + (-icon[0] * 48)+ 'px ' + (-icon[1] * 48) + 'px')};">
	</div>`;
};

/********
 * Section: Functions related to the left column of the page */

/**
 * This function creates two objects at the bottom of the left column that allowing popping of wrinklers
 * It is called by CM.Main.DelayInit()
 */
CM.Disp.CreateWrinklerButtons = function() {
	let popAllA = document.createElement('a');
	popAllA.id = "PopAllNormalWrinklerButton";
	popAllA.textContent = 'Pop All Normal';
	popAllA.className = 'option';
	popAllA.onclick = function() { CM.Disp.PopAllNormalWrinklers(); };
	l('sectionLeftExtra').children[0].append(popAllA);
	let popFattestA = document.createElement('a');
	popFattestA.id = "PopFattestWrinklerButton";
	popFattestA.textContent = 'Pop Single Fattest';
	popFattestA.className = 'option';
	popFattestA.onclick = function() {if (CM.Cache.WrinklersFattest[1]) Game.wrinklers[CM.Cache.WrinklersFattest[1]].hp = 0; };
	l('sectionLeftExtra').children[0].append(popFattestA);
};

/**
 * This function updates the display setting of the two objects created by CM.Disp.CreateWrinklerButtons()
 * It is called by changes in CM.Options.WrinklerButtons
 */
CM.Disp.UpdateWrinklerButtons = function() {
	if (CM.Options.WrinklerButtons) {
		l('PopAllNormalWrinklerButton').style.display = "";
		l('PopFattestWrinklerButton').style.display = "";
	}
	else {
		l('PopAllNormalWrinklerButton').style.display = "none";
		l('PopFattestWrinklerButton').style.display = "none";
	}
};

/********
 * Section: Variables used in Disp functions */

/**
 * This list is used to make some very basic tooltips.
 * It is used by CM.Main.DelayInit() in the call of CM.Disp.CreateSimpleTooltip()
 * @item	{string}	placeholder	
 * @item	{string}	text		
 * @item	{string}	minWidth	
 */
CM.Disp.TooltipText = [
	['GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px'],
	['GoldCookDragonsFortuneTooltipPlaceholder', 'Calculated with Golden Switch off and at least one golden cookie on-screen', '240px'],
	['PrestMaxTooltipPlaceholder', 'The MAX prestige is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '320px'], 
	['NextPrestTooltipPlaceholder', 'Calculated with cookies gained from wrinklers and Chocolate egg', '200px'], 
	['HeavenChipMaxTooltipPlaceholder', 'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg', '330px'], 
	['ResetTooltipPlaceholder', 'The bonus income you would get from new prestige levels unlocked at 100% of its potential and from ascension achievements if you have the same buildings/upgrades after reset', '370px'], 
	['ChoEggTooltipPlaceholder', 'The amount of cookies you would get from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and then buying Chocolate egg', '300px']
];

/**
 * These are variables used to create DOM object names and id (e.g., 'CMTextTooltip)
 */
CM.Disp.colorTextPre = 'CMText';
CM.Disp.colorBackPre = 'CMBack';
CM.Disp.colorBorderPre = 'CMBorder';

/**
 * These are variables which can be set in the options by the user to standardize colours throughout CookieMonster
 */
CM.Disp.colorBlue = 'Blue';
CM.Disp.colorGreen = 'Green';
CM.Disp.colorYellow = 'Yellow';
CM.Disp.colorOrange = 'Orange';
CM.Disp.colorRed = 'Red';
CM.Disp.colorPurple = 'Purple';
CM.Disp.colorGray = 'Gray';
CM.Disp.colorPink = 'Pink';
CM.Disp.colorBrown = 'Brown';
CM.Disp.colors = [CM.Disp.colorBlue, CM.Disp.colorGreen, CM.Disp.colorYellow, CM.Disp.colorOrange, CM.Disp.colorRed, CM.Disp.colorPurple, CM.Disp.colorGray, CM.Disp.colorPink, CM.Disp.colorBrown];


/**
 * This array is used to give certain timers specific colours
 */
CM.Disp.buffColors = {'Frenzy': CM.Disp.colorYellow, 'Dragon Harvest': CM.Disp.colorBrown, 'Elder frenzy': CM.Disp.colorGreen, 'Clot': CM.Disp.colorRed, 'Click frenzy': CM.Disp.colorBlue, 'Dragonflight': CM.Disp.colorPink};

/**
 * This array is used to track GC timers
 */
CM.Disp.GCTimers = {};

/**
 * These arrays are used in the stats page to show 
 * average cookies per {CM.Disp.cookieTimes/CM.Disp.clickTimes} seconds
 */
CM.Disp.cookieTimes = [10, 15, 30, 60, 300, 600, 900, 1800];
CM.Disp.clickTimes = [1, 5, 10, 15, 30];

/**
 * This array is used to store whether a Wrinkler tooltip is being shown or not
 * [i] = 1 means tooltip is being shown, [i] = 0 means hidden
 * It is used by CM.Disp.CheckWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
CM.Disp.TooltipWrinklerBeingShown = [];

/**
 * These are variables used by the functions that create tooltips for wrinklers
 * See CM.Disp.CheckWrinklerTooltip(), CM.Disp.UpdateWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
CM.Disp.TooltipWrinklerArea = 0;
CM.Disp.TooltipWrinkler = -1;


/**
 * Used to store the number of cookies to be displayed in the tab-title
 */
CM.Disp.Title = '';
