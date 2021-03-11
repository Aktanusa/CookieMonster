/** Section: Functions related to the Golden Cookie Timers */

import { GCTimers } from './VariablesAndData';

/**
 * This function creates a new Golden Cookie Timer and appends it CM.Disp.GCTimers based on the id of the cookie
 * @param	{object}	cookie	A Golden Cookie object
 */
export function CreateGCTimer(cookie) {
	const GCTimer = document.createElement('div');
	GCTimer.id = `GCTimer${cookie.id}`;
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
	GCTimer.onclick = function () { cookie.pop(); };
	GCTimer.onmouseover = function () { cookie.l.style.filter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; cookie.l.style.webkitFilter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; };
	GCTimer.onmouseout = function () { cookie.l.style.filter = ''; cookie.l.style.webkitFilter = ''; };

	GCTimers[cookie.id] = GCTimer;
	l('shimmers').appendChild(GCTimer);
}

/**
 * This function toggles GC Timers are visible
 * It is called by a change in CM.Options.GCTimer
 */
export function ToggleGCTimer() {
	if (CM.Options.GCTimer === 1) {
		for (const i of Object.keys(GCTimers)) {
			GCTimers[i].style.display = 'block';
			GCTimers[i].style.left = CM.Cache.goldenShimmersByID[i].l.style.left;
			GCTimers[i].style.top = CM.Cache.goldenShimmersByID[i].l.style.top;
		}
	} else {
		for (const i of Object.keys(GCTimers)) GCTimers[i].style.display = 'none';
	}
}
