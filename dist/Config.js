(()=>{"use strict";function o(){const o=b64_to_utf8(unescape(localStorage.getItem("CookieClickerGame")).split("!END!")[0]),i=o.match(/CookieMonster.*(;|$)/);if(null!==i){const n=o.replace(i[0],`CookieMonster:${CM.save()}`);localStorage.setItem("CookieClickerGame",escape(`${utf8_to_b64(n)}!END!`))}}function i(o){if(void 0!==localStorage.CMConfig&&delete localStorage.CMConfig,void 0!==o){CM.Options=o;let i=!1;for(const o in CM.Data.ConfigDefault)if(void 0===CM.Options[o])i=!0,CM.Options[o]=CM.Data.ConfigDefault[o];else if("Header"!==o&&"Colors"!==o)-1===o.indexOf("SoundURL")?CM.Options[o]>-1&&CM.Options[o]<CM.Data.Config[o].label.length||(i=!0,CM.Options[o]=CM.Data.ConfigDefault[o]):"string"!=typeof CM.Options[o]&&(i=!0,CM.Options[o]=CM.Data.ConfigDefault[o]);else if("Header"===o)for(const n in CM.Data.ConfigDefault.Header)void 0!==CM.Options[o][n]&&CM.Options[o][n]>-1&&CM.Options[o][n]<2||(i=!0,CM.Options[o][n]=CM.Data.ConfigDefault[o][n]);else for(const n in CM.Data.ConfigDefault.Colors)void 0!==CM.Options[o][n]&&"string"==typeof CM.Options[o][n]||(i=!0,CM.Options[o][n]=CM.Data.ConfigDefault[o][n]);i&&CM.Config.SaveConfig(),CM.Main.Loop();for(const o in CM.Data.ConfigDefault)"Header"!==o&&void 0!==CM.Data.Config[o].func&&CM.Data.Config[o].func()}else CM.Config.RestoreDefault()}const n={CheckNotificationPermissions:function(o){if(1===o){const o=function(){try{Notification.requestPermission().then()}catch(o){return!1}return!0};"Notification"in window?o()?Notification.requestPermission().then():Notification.requestPermission():console.log("This browser does not support notifications.")}},LoadConfig:i,SaveConfig:o,RestoreDefault:function(){i(CM.Data.ConfigDefault),o(),Game.UpdateMenu()},ToggleConfig:function(o){CM.Options[o]++,CM.Options[o]===CM.Data.Config[o].label.length?(CM.Options[o]=0,CM.Data.Config[o].toggle&&(l(CM.Config.ConfigPrefix+o).className="option off")):l(CM.Config.ConfigPrefix+o).className="option",void 0!==CM.Data.Config[o].func&&CM.Data.Config[o].func(),l(CM.Config.ConfigPrefix+o).innerHTML=CM.Data.Config[o].label[CM.Options[o]],CM.Config.SaveConfig()},ToggleConfigVolume:function(o){null!==l(`slider${o}`)&&(l(`slider${o}right`).innerHTML=`${l(`slider${o}`).value}%`,CM.Options[o]=Math.round(l(`slider${o}`).value)),CM.Config.SaveConfig()},ToggleHeader:function(o){CM.Options.Header[o]++,CM.Options.Header[o]>1&&(CM.Options.Header[o]=0),CM.Config.SaveConfig()},ConfigPrefix:"CMConfig"};CM.Config=n})();