import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { makeSelectProxyAddr } from '../AccountProvider/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// direct selectors to state
const tableStateSelector = (state) => (state) ? state.get('table') : null;


// other selectors
const makeHandSelector = () => createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.get('hand') : null
);

const makeLineupSelector = () => createSelector(
  tableStateSelector,
  (table) => (table.get('hand').lineup) ? table.get('hand').lineup : null
);

const makeSbSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState.get('smallBlind'))
);

const makeAmountSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState) ? tableState.get('amount') : null
);

const makeLastHandNettedSelector = () => createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.get('lastHandNettedOnClient') : null
);

const makeMyPosSelector = () => createSelector(
    [makeLineupSelector(), makeSelectProxyAddr()],
    (lineup, myAddress) => (lineup && myAddress) ? pokerHelper.getMyPos(lineup, myAddress) : null
);

const makeWhosTurnSelector = () => createSelector(
    makeHandSelector(),
    (hand) => (hand && hand.lineup && hand.lineup.length > 0) ? pokerHelper.whosTurn(hand) : null
);

const makeIsMyTurnSelector = () => createSelector(
    [makeMyPosSelector(), makeWhosTurnSelector()],
    (myPos, whosTurn) => (myPos && whosTurn) ? myPos === whosTurn : false
);

const makeMaxBetSelector = () => createSelector(
    [makeHandSelector(), makeLineupSelector()],
    (hand, lineup) => (hand && lineup) ? pokerHelper.findMaxBet(lineup, hand.dealer).amount : 0
);

const makeMyMaxBetSelector = () => createSelector(
    [makeLineupSelector(), makeSelectProxyAddr()],
    (lineup, myAddress) => (lineup && myAddress) ? pokerHelper.getMyMaxBet(lineup, myAddress) : 0
);

const makeAmountToCallSelector = () => createSelector(
    [makeMaxBetSelector(), makeMyMaxBetSelector()],
    (maxBet, myMaxbet) => (maxBet && myMaxbet) ? maxBet - myMaxbet : 0
);

const makePotSizeSelector = () => createSelector(
    makeLineupSelector(),
    (lineup) => (lineup) ? pokerHelper.calculatePotsize(lineup) : 0
);

const makeModalStackSelector = () => createSelector(
  tableStateSelector,
  (tableState) => tableState.get('modalStack')
);

const makeNetRequestSelector = () => createSelector(
  tableStateSelector,
  (tableState) => tableState.get('hand').netting
);

export {
    tableStateSelector,
    makeAmountSelector,
    makeLineupSelector,
    makeIsMyTurnSelector,
    makeWhosTurnSelector,
    makeLastHandNettedSelector,
    makePotSizeSelector,
    makeAmountToCallSelector,
    makeMyPosSelector,
    makeHandSelector,
    makeMaxBetSelector,
    makeMyMaxBetSelector,
    makeModalStackSelector,
    makeNetRequestSelector,
    makeSbSelector,
};

