/* eslint-disable no-unused-vars */
import { ClickTimes, CookieTimes } from '../../Disp/VariablesAndData';
import {
	ChoEggDiff, ClicksDiff, CookiesDiff, WrinkDiff, WrinkFattestDiff,
} from '../VariablesAndData';

/**
 * @class
 * @classdesc 	This is a class used to store values used to calculate average over time (mostly cps)
 * @var			{number}				maxLength	The maximum length of the value-storage
 * @var			{[]}					queue		The values stored
 * @method		addLatest(newValue)		Appends newValue to the value storage
 * @method		calcAverage(timePeriod)	Returns the average over the specified timeperiod
 */
export class CMAvgQueue {
	constructor(maxLength) {
		this.maxLength = maxLength;
		this.queue = [];
	}

	addLatest(newValue) {
		if (this.queue.push(newValue) > this.maxLength) {
			this.queue.shift();
		}
	}

	/**
	 * This functions returns the average of the values in the queue
	 * @param 	{number}	timePeriod	The period in seconds to computer average over
	 * @returns {number}	ret			The average
 	 */
	calcAverage(timePeriod) {
		if (timePeriod > this.maxLength) timePeriod = this.maxLength;
		if (timePeriod > this.queue.length) timePeriod = this.queue.length;
		let ret = 0;
		for (let i = this.queue.length - 1; i >= 0 && i > this.queue.length - 1 - timePeriod; i--) {
			ret += this.queue[i];
		}
		if (ret === 0) {
			return 0;
		}
		return ret / timePeriod;
	}
}

/**
 * This functions caches creates the CMAvgQueue used by CM.Cache.CacheAvgCPS() to calculate CPS
 * Called by CM.Cache.InitCache()
 */
export function InitCookiesDiff() {
	CookiesDiff = new CMAvgQueue(CookieTimes[CookieTimes.length - 1]);
	WrinkDiff = new CMAvgQueue(CookieTimes[CookieTimes.length - 1]);
	WrinkFattestDiff = new CMAvgQueue(CookieTimes[CookieTimes.length - 1]);
	ChoEggDiff = new CMAvgQueue(CookieTimes[CookieTimes.length - 1]);
	ClicksDiff = new CMAvgQueue(ClickTimes[ClickTimes.length - 1]);
}
