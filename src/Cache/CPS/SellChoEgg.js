/* eslint-disable no-unused-vars */
import SellBuildingsForChoEgg from '../../Sim/SimulationEvents/SellBuildingForChoEgg';
import { CacheSellForChoEgg } from '../VariablesAndData';

/**
 * This functions caches the reward for selling the Chocolate egg
 * It is called by CM.Main.Loop()
 * @global	{number}	CM.Cache.SellForChoEgg	Total cookies to be gained from selling Chocolate egg
 */
export default function CacheSellAllForChoEgg() {
  let sellTotal = 0;
  // Compute cookies earned by selling stock market goods
  if (Game.Objects.Bank.minigameLoaded) {
    const marketGoods = Game.Objects.Bank.minigame.goods;
    let goodsVal = 0;
    for (const i of Object.keys(marketGoods)) {
      const marketGood = marketGoods[i];
      goodsVal += marketGood.stock * marketGood.val;
    }
    sellTotal += goodsVal * Game.cookiesPsRawHighest;
  }
  // Compute cookies earned by selling all buildings with optimal auras (ES + RB)
  sellTotal += SellBuildingsForChoEgg();
  CacheSellForChoEgg = sellTotal;
}
