let players = [
{"name":"Kylian Mbappe","position":"ST","category":"attacker","rating":93,"price":120,"club":"PSG","country":"France"},
{"name":"Erling Haaland","position":"ST","category":"attacker","rating":92,"price":115,"club":"Man City","country":"Norway"},
{"name":"Vinicius Jr","position":"LW","category":"attacker","rating":91,"price":110,"club":"Real Madrid","country":"Brazil"},
{"name":"Mohamed Salah","position":"RW","category":"attacker","rating":90,"price":105,"club":"Liverpool","country":"Egypt"},
{"name":"Harry Kane","position":"ST","category":"attacker","rating":91,"price":108,"club":"Bayern","country":"England"},
{"name":"Bukayo Saka","position":"RW","category":"attacker","rating":89,"price":95,"club":"Arsenal","country":"England"},
{"name":"Phil Foden","position":"LW","category":"attacker","rating":90,"price":100,"club":"Man City","country":"England"},
{"name":"Son Heung-min","position":"LW","category":"attacker","rating":88,"price":90,"club":"Tottenham","country":"South Korea"},
{"name":"Lautaro Martinez","position":"ST","category":"attacker","rating":89,"price":100,"club":"Inter","country":"Argentina"},
{"name":"Victor Osimhen","position":"ST","category":"attacker","rating":88,"price":95,"club":"Napoli","country":"Nigeria"},
{"name":"Rafael Leao","position":"LW","category":"attacker","rating":87,"price":85,"club":"AC Milan","country":"Portugal"},
{"name":"Jadon Sancho","position":"RW","category":"attacker","rating":86,"price":80,"club":"Man Utd","country":"England"},
{"name":"Raphinha","position":"RW","category":"attacker","rating":85,"price":75,"club":"Barcelona","country":"Brazil"},
{"name":"Gabriel Jesus","position":"ST","category":"attacker","rating":87,"price":85,"club":"Arsenal","country":"Brazil"},
{"name":"Kevin De Bruyne","position":"CM","category":"midfielder","rating":92,"price":115,"club":"Man City","country":"Belgium"},
{"name":"Jude Bellingham","position":"CAM","category":"midfielder","rating":91,"price":110,"club":"Real Madrid","country":"England"},
{"name":"Luka Modric","position":"CM","category":"midfielder","rating":88,"price":85,"club":"Real Madrid","country":"Croatia"},
{"name":"Rodri","position":"CDM","category":"midfielder","rating":90,"price":105,"club":"Man City","country":"Spain"},
{"name":"Bernardo Silva","position":"CM","category":"midfielder","rating":89,"price":95,"club":"Man City","country":"Portugal"},
{"name":"Bruno Fernandes","position":"CAM","category":"midfielder","rating":88,"price":90,"club":"Man Utd","country":"Portugal"},
{"name":"Pedri","position":"CM","category":"midfielder","rating":87,"price":85,"club":"Barcelona","country":"Spain"},
{"name":"Frenkie de Jong","position":"CM","category":"midfielder","rating":88,"price":90,"club":"Barcelona","country":"Netherlands"},
{"name":"Joshua Kimmich","position":"CDM","category":"midfielder","rating":89,"price":95,"club":"Bayern","country":"Germany"},
{"name":"Martin Odegaard","position":"CAM","category":"midfielder","rating":87,"price":85,"club":"Arsenal","country":"Norway"},
{"name":"James Maddison","position":"CAM","category":"midfielder","rating":86,"price":80,"club":"Tottenham","country":"England"},
{"name":"Enzo Fernandez","position":"CDM","category":"midfielder","rating":85,"price":75,"club":"Chelsea","country":"Argentina"},
{"name":"Virgil van Dijk","position":"CB","category":"defender","rating":91,"price":110,"club":"Liverpool","country":"Netherlands"},
{"name":"Ruben Dias","position":"CB","category":"defender","rating":90,"price":105,"club":"Man City","country":"Portugal"},
{"name":"Marquinhos","position":"CB","category":"defender","rating":89,"price":95,"club":"PSG","country":"Brazil"},
{"name":"Antonio Rudiger","position":"CB","category":"defender","rating":88,"price":90,"club":"Real Madrid","country":"Germany"},
{"name":"Achraf Hakimi","position":"RB","category":"defender","rating":88,"price":90,"club":"PSG","country":"Morocco"},
{"name":"Theo Hernandez","position":"LB","category":"defender","rating":87,"price":85,"club":"AC Milan","country":"France"},
{"name":"Trent Alexander-Arnold","position":"RB","category":"defender","rating":88,"price":90,"club":"Liverpool","country":"England"},
{"name":"Joao Cancelo","position":"LB","category":"defender","rating":87,"price":85,"club":"Barcelona","country":"Portugal"},
{"name":"John Stones","position":"CB","category":"defender","rating":86,"price":80,"club":"Man City","country":"England"},
{"name":"Reece James","position":"RB","category":"defender","rating":85,"price":75,"club":"Chelsea","country":"England"},
{"name":"Alphonso Davies","position":"LB","category":"defender","rating":86,"price":80,"club":"Bayern","country":"Canada"},
{"name":"Thibaut Courtois","position":"GK","category":"goalkeeper","rating":91,"price":105,"club":"Real Madrid","country":"Belgium"},
{"name":"Alisson Becker","position":"GK","category":"goalkeeper","rating":90,"price":100,"club":"Liverpool","country":"Brazil"},
{"name":"Ederson","position":"GK","category":"goalkeeper","rating":89,"price":95,"club":"Man City","country":"Brazil"},
{"name":"Marc-Andre ter Stegen","position":"GK","category":"goalkeeper","rating":90,"price":100,"club":"Barcelona","country":"Germany"},
{"name":"Gianluigi Donnarumma","position":"GK","category":"goalkeeper","rating":88,"price":90,"club":"PSG","country":"Italy"},
{"name":"Aaron Ramsdale","position":"GK","category":"goalkeeper","rating":85,"price":75,"club":"Arsenal","country":"England"}
];

let numPlayers = 4;
let currentPlayer = 1;
let gameState = {};
let currentPosition = null;
let currentPlayerData = null;
let sellingPlayer = null;
let riskPicksLeft = 2;          // resets each selection
let riskPickSeen = new Set();   // names seen this selection round

// Position slots — CAM used for attack, CDM used for defend (both map to same index slot)
const positionsAttack = ["GK","LB","CB1","CB2","RB","CM1","CM2","CAM","LW","ST","RW"];
const positionsDefend = ["GK","LB","CB1","CB2","RB","CM1","CM2","CDM","LW","ST","RW"];
const positions = positionsAttack; // default; getAvailablePositions uses player.formation

// Position to category mapping
const positionToCategory = {
  LW: 'attacker', RW: 'attacker', ST: 'attacker', CF: 'attacker',
  RM: 'midfielder', LM: 'midfielder', CAM: 'midfielder', CDM: 'midfielder', CM: 'midfielder',
  RB: 'defender', LB: 'defender', CB: 'defender', RWB: 'defender', LWB: 'defender',
  GK: 'goalkeeper'
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getFilledPositions(player) {
  return player.squad.map(p => p.assignedPos);
}

function getAvailablePositions(player) {
  const slots = player.formation === 'defend' ? positionsDefend : positionsAttack;
  const filled = getFilledPositions(player);
  return slots.filter(pos => !filled.includes(pos));
}

function getDisplayLabel(pos) {
  if (pos === 'CDM') return 'DM';
  return pos.replace(/\d+$/, ''); // CM1 → CM, CB2 → CB
}

function updateTurnInfo() {
  document.getElementById('current-player').textContent = currentPlayer;
  document.getElementById('budget').textContent = gameState.players[currentPlayer - 1].budget;
}

function hideCard() {
  document.getElementById('player-card').classList.add('hidden');
  document.getElementById('sell-interface').classList.add('hidden');
  document.getElementById('bid-section').classList.add('hidden');
  document.getElementById('accept-section').classList.add('hidden');
  document.getElementById('trade-assign-modal').classList.add('hidden');
}

function hidePositionUI() {
  document.getElementById('position-select').classList.add('hidden');
  document.getElementById('get-player').classList.add('hidden');
  document.getElementById('position-title').classList.add('hidden');
  document.getElementById('position-display').textContent = '';
}

// ─── Render squad on pitch ───────────────────────────────────────────────────

function renderSquad() {
  const player = gameState.players[currentPlayer - 1];

  // Show correct pitch based on formation
  const pitchAttack = document.getElementById('pitch-attack');
  const pitchDefend = document.getElementById('pitch-defend');
  if (player.formation === 'defend') {
    pitchAttack.classList.add('hidden');
    pitchDefend.classList.remove('hidden');
  } else {
    pitchDefend.classList.add('hidden');
    pitchAttack.classList.remove('hidden');
  }

  document.querySelectorAll('.pos').forEach(pos => {
    const posName = pos.dataset.pos;
    const p = player.squad.find(p => p.assignedPos === posName);
    if (p) {
      pos.textContent = `${p.name.split(' ').pop()} (${p.adjustedRating})`;
      pos.classList.add('filled');
      pos.classList.toggle('captain', !!(player.captain && player.captain.name === p.name));
    } else {
      pos.textContent = getDisplayLabel(posName);
      pos.classList.remove('filled', 'captain');
    }
  });
}

// ─── Calculate adjusted rating ───────────────────────────────────────────────

function calculateRating(player, assignedPos) {
  const basePos = assignedPos.replace(/\d+$/, '');
  if (player.position === basePos) return player.rating;
  const playerCat = positionToCategory[player.position];
  const assignedCat = positionToCategory[basePos] || positionToCategory[assignedPos];
  if (playerCat === assignedCat) return player.rating - 3;
  return player.rating - 5;
}

// Recalculate chemistry for a player's whole squad
function recalculateChemistry(player) {
  player.squad.forEach(p => {
    let chem = 0;
    player.squad.forEach(q => {
      if (p !== q) {
        if (p.club === q.club) chem++;
        if (p.country === q.country) chem++;
      }
    });
    p.chemBonus = Math.min(chem, 5);
    p.adjustedRating = calculateRating(p, p.assignedPos) + p.chemBonus + (player.captain && player.captain.name === p.name ? 2 : 0);
  });
}

// ─── Show player card ────────────────────────────────────────────────────────

function showPlayerCard(p) {
  document.getElementById('player-name').textContent = p.name;
  document.getElementById('player-pos').textContent = p.position;
  document.getElementById('player-rating').textContent = p.rating;
  document.getElementById('player-price').textContent = p.price;
  document.getElementById('player-club').textContent = p.club;
  document.getElementById('player-country').textContent = p.country;

  const player = gameState.players[currentPlayer - 1];
  const available = getAvailablePositions(player);
  const assignSelect = document.getElementById('assign-pos');
  assignSelect.innerHTML = '<option value="">Choose Position</option>' + available.map(pos => {
    return `<option value="${pos}">${getDisplayLabel(pos)}</option>`;
  }).join('');

  // Pre-select the position that was chosen
  if (currentPosition) assignSelect.value = currentPosition;

  document.getElementById('risk-picks-left').textContent = riskPicksLeft;
  document.getElementById('player-card').classList.remove('hidden');
}

// ─── Price penalty preview ────────────────────────────────────────────────────

function getPricePenalty(footballer, slotKey) {
  if (!slotKey) return 0;
  const baseSlot = slotKey.replace(/\d+$/, ''); // CM1->CM
  const naturalPos = footballer.position;
  if (naturalPos === baseSlot) return 0;
  // CDM slot is sub-category of midfielder; CAM slot too
  const naturalCat = positionToCategory[naturalPos] || 'unknown';
  const slotCat = positionToCategory[baseSlot] || positionToCategory[slotKey] || 'unknown';
  if (naturalCat === slotCat) return 15;  // same main category, different role
  return 30;                              // different main category
}

document.getElementById('assign-pos').addEventListener('change', function() {
  if (!currentPlayerData) return;
  const penalty = getPricePenalty(currentPlayerData, this.value);
  const note = document.getElementById('price-penalty-note');
  if (penalty > 0) {
    note.textContent = '(-$' + penalty + 'M off-position penalty)';
  } else {
    note.textContent = this.value ? '(no penalty)' : '';
  }
});

// ─── Start game ──────────────────────────────────────────────────────────────

document.getElementById('start-game').addEventListener('click', () => {
  numPlayers = parseInt(document.getElementById('num-players').value);
  if (numPlayers < 2 || numPlayers > 6) {
    alert('Please choose between 2 and 6 players.');
    return;
  }
  gameState = { players: [] };
  for (let i = 1; i <= numPlayers; i++) {
    gameState.players.push({
      id: i,
      budget: 1000,
      squad: [],
      captain: null,
      score: 0,
      votes: 0,
      formation: null
    });
  }
  document.getElementById('title-screen').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');
  currentPlayer = 1;
  startTurn();
});

// ─── Start a player's turn ───────────────────────────────────────────────────

function startTurn() {
  riskPicksLeft = 2;
  riskPickSeen = new Set();
  hideCard();
  hidePositionUI();
  document.getElementById('sell-squad-section').classList.add('hidden');
  document.getElementById('captain-select').classList.add('hidden');
  document.getElementById('next-turn').classList.add('hidden');

  updateTurnInfo();
  renderSquad();

  const player = gameState.players[currentPlayer - 1];

  // If squad is full but no captain yet, prompt captain selection
  if (player.squad.length >= 11 && !player.captain) {
    document.getElementById('captain-dropdown').innerHTML =
      player.squad.map(p => `<option value="${p.name}">${p.name} (${p.adjustedRating})</option>`).join('');
    document.getElementById('captain-select').classList.remove('hidden');
    return;
  }

  // First turn for this player — choose formation
  if (!player.formation) {
    document.getElementById('formation-select').classList.remove('hidden');
    return;
  }

  showPositionSelect();
}

// ─── Show position select (and optionally sell button) ───────────────────────

function showPositionSelect() {
  const player = gameState.players[currentPlayer - 1];
  const available = getAvailablePositions(player);

  if (available.length === 0) {
    // Squad is full — go to captain selection or next turn
    checkTurnEnd();
    return;
  }

  const select = document.getElementById('position-select');
  select.innerHTML = '<option value="">Choose Position</option>' + available.map(pos => {
    return `<option value="${pos}">${getDisplayLabel(pos)}</option>`;
  }).join('');

  document.getElementById('position-title').classList.remove('hidden');
  document.getElementById('position-select').classList.remove('hidden');
  document.getElementById('get-player').classList.remove('hidden');

  // Show sell-from-squad button only if player has squad members
  if (player.squad.length > 0) {
    document.getElementById('sell-squad-section').classList.remove('hidden');
    populateSellDropdown(player);
  }
}

// ─── Confirm formation ───────────────────────────────────────────────────────

document.getElementById('confirm-formation').addEventListener('click', () => {
  const formation = document.getElementById('formation-choice').value;
  gameState.players[currentPlayer - 1].formation = formation;
  document.getElementById('formation-select').classList.add('hidden');
  showPositionSelect();
});

// ─── Get player for position ───────────────────────────────────────────

document.getElementById('get-player').addEventListener('click', () => {
  const selectedPos = document.getElementById('position-select').value;
  if (!selectedPos) { alert('Please choose a position first!'); return; }

  currentPosition = selectedPos;

  // Map slot to lookup position(s)
  const lookupPos = selectedPos.replace(/\d+$/, ''); // CM1->CM, CB2->CB

  let filtered = players.filter(p => {
    if (lookupPos === 'CDM') return p.position === 'CDM' || p.position === 'CM';
    if (lookupPos === 'CAM') return p.position === 'CAM' || p.position === 'CM';
    return p.position === lookupPos;
  });

  // No players left for that position -- fall back to the full pool
  if (filtered.length === 0) {
    if (players.length === 0) { alert('The entire player pool is empty!'); return; }
    const label = getDisplayLabel(selectedPos);
    alert('No ' + label + ' players left! Drawing from the full pool instead. Assign them to any open slot.');
    filtered = [...players];
    currentPosition = null; // don't pre-select; let them choose freely
  }

  // Pick a player not already seen this round
  const unseen = filtered.filter(p => !riskPickSeen.has(p.name));
  const pool = unseen.length > 0 ? unseen : filtered; // fallback if all seen
  currentPlayerData = pool[Math.floor(Math.random() * pool.length)];
  riskPickSeen = new Set(); // fresh round
  riskPickSeen.add(currentPlayerData.name);
  riskPicksLeft = 2;
  hidePositionUI();
  showPlayerCard(currentPlayerData);
});

// ─── Keep player ─────────────────────────────────────────────────────────────

document.getElementById('keep-player').addEventListener('click', () => {
  const assignPos = document.getElementById('assign-pos').value;
  if (!assignPos) { alert('Please select a position to assign!'); return; }

  const player = gameState.players[currentPlayer - 1];
  if (player.budget < currentPlayerData.price) {
    alert(`Not enough budget! You need $${currentPlayerData.price}M but have $${player.budget}M.`);
    return;
  }

  // If slot is already occupied, refund and remove old player
  const existing = player.squad.find(p => p.assignedPos === assignPos);
  if (existing) {
    player.budget += Math.round(existing.price * 0.8);
    player.squad = player.squad.filter(p => p !== existing);
    players.push(existing); // return to pool
  }

  const penalty = getPricePenalty(currentPlayerData, assignPos);
  const effectivePrice = currentPlayerData.price - penalty;
  player.budget -= effectivePrice;
  currentPlayerData.pricePaid = effectivePrice; // store what was actually paid
  currentPlayerData.assignedPos = assignPos;
  currentPlayerData.adjustedRating = calculateRating(currentPlayerData, assignPos);
  currentPlayerData.chemBonus = 0;
  player.squad.push(currentPlayerData);

  // Remove from pool
  const idx = players.findIndex(p => p.name === currentPlayerData.name);
  if (idx > -1) players.splice(idx, 1);

  recalculateChemistry(player);
  renderSquad();
  updateTurnInfo();
  hideCard();
  // Round-robin: always pass to next player after picking one player
  nextTurn();
});

// ─── Risk Pick ───────────────────────────────────────────────────────────────

document.getElementById('risk-pick').addEventListener('click', () => {
  if (riskPicksLeft <= 0) {
    alert('No Risk Picks left for this selection! You must Keep, Skip, or Sell the current player.');
    return;
  }
  if (players.length === 0) { alert('No players left in the pool!'); return; }

  // Exclude players already seen this round
  const unseen = players.filter(p => !riskPickSeen.has(p.name));
  if (unseen.length === 0) {
    alert('You have seen all available players this round! Please Keep, Skip, or Sell.');
    return;
  }

  riskPicksLeft--;
  const randomPlayer = unseen[Math.floor(Math.random() * unseen.length)];
  riskPickSeen.add(randomPlayer.name);
  currentPlayerData = randomPlayer;
  currentPosition = null; // risk pick can go in any slot
  document.getElementById('risk-picks-left').textContent = riskPicksLeft;
  showPlayerCard(randomPlayer);
});

// ─── Skip player (don't buy, just pass) ──────────────────────────────────────

document.getElementById('skip-player').addEventListener('click', () => {
  hideCard();
  // Decrease position count since we didn't actually lock in
  showPositionSelect();
});

// ─── Sell from squad (mid-turn) ──────────────────────────────────────────────

function populateSellDropdown(player) {
  const sel = document.getElementById('sell-squad-select');
  sel.innerHTML = '<option value="">-- Select player to sell --</option>' +
    player.squad.map(p => `<option value="${p.name}">${p.name} ($${Math.round((p.pricePaid||p.price) * 0.8)}M refund)</option>`).join('');
}

document.getElementById('sell-squad-btn').addEventListener('click', () => {
  const sel = document.getElementById('sell-squad-select');
  const playerName = sel.value;
  if (!playerName) { alert('Select a player to sell!'); return; }

  const player = gameState.players[currentPlayer - 1];
  const toSell = player.squad.find(p => p.name === playerName);
  if (!toSell) return;

  const refund = Math.round((toSell.pricePaid || toSell.price) * 0.8);
  player.budget += refund;
  player.squad = player.squad.filter(p => p !== toSell);
  // Return player to pool (remove assignedPos)
  delete toSell.assignedPos;
  delete toSell.adjustedRating;
  delete toSell.chemBonus;
  players.push(toSell);

  recalculateChemistry(player);
  renderSquad();
  updateTurnInfo();
  document.getElementById('sell-squad-section').classList.add('hidden');
  alert(`Sold ${toSell.name} for $${refund}M!`);
  showPositionSelect();
});

// ─── Sell to another player (trade) ──────────────────────────────────────────

document.getElementById('sell-player').addEventListener('click', () => {
  const assignPos = document.getElementById('assign-pos').value;
  // Sell the card just drawn OR a specific squad member
  sellingPlayer = currentPlayerData;
  document.getElementById('sell-player-name').textContent = sellingPlayer.name;
  const otherPlayers = gameState.players.filter(p => p.id !== currentPlayer);
  document.getElementById('sell-to-player').innerHTML = otherPlayers.map(p => `<option value="${p.id}">Player ${p.id}</option>`).join('');
  document.getElementById('sell-interface').classList.remove('hidden');
  document.getElementById('player-card').classList.add('hidden');
});

document.getElementById('offer-sell').addEventListener('click', () => {
  const buyerId = parseInt(document.getElementById('sell-to-player').value);
  document.getElementById('bidder').textContent = buyerId;
  document.getElementById('bid-section').classList.remove('hidden');
  alert(`Pass the device to Player ${buyerId} to enter their bid.`);
});

document.getElementById('submit-bid').addEventListener('click', () => {
  const bid = parseInt(document.getElementById('bid-amount').value);
  if (isNaN(bid) || bid <= 0) { alert('Enter a valid bid!'); return; }
  document.getElementById('bid-value').textContent = bid;
  document.getElementById('bidder-name').textContent = document.getElementById('bidder').textContent;
  document.getElementById('bid-section').classList.add('hidden');
  document.getElementById('accept-section').classList.remove('hidden');
});

// Stored trade context for the position-picker modal
let pendingTrade = null;

document.getElementById('accept-bid').addEventListener('click', () => {
  const bid = parseInt(document.getElementById('bid-value').textContent);
  const buyerId = parseInt(document.getElementById('bidder-name').textContent);
  const seller = gameState.players[currentPlayer - 1];
  const buyer = gameState.players.find(p => p.id === buyerId);

  if (buyer.budget < bid) {
    alert('Player ' + buyerId + " doesn't have enough budget ($" + buyer.budget + 'M)!');
    return;
  }

  // Deduct money immediately
  seller.budget += bid;
  buyer.budget -= bid;
  // Remove from seller squad
  seller.squad = seller.squad.filter(p => p !== sellingPlayer);
  recalculateChemistry(seller);

  document.getElementById('sell-interface').classList.add('hidden');
  document.getElementById('accept-section').classList.add('hidden');
  hideCard();

  // --- Try to auto-assign to buyer's matching open slot ---
  const naturalPos = sellingPlayer.position; // e.g. "ST", "CM", "GK"
  const buyerSlots = buyer.formation === 'defend' ? positionsDefend : positionsAttack;
  const filledBuyer = buyer.squad.map(p => p.assignedPos);

  // Find a free slot whose base label matches the player's natural position
  const autoSlot = buyerSlots.find(slot => {
    if (filledBuyer.includes(slot)) return false;
    const base = slot.replace(/\d+$/, '');
    if (base === naturalPos) return true;
    // CDM slot accepts CDM or CM players
    if (base === 'CDM' && (naturalPos === 'CDM' || naturalPos === 'CM')) return true;
    if (base === 'CAM' && (naturalPos === 'CAM' || naturalPos === 'CM')) return true;
    return false;
  });

  if (autoSlot) {
    // Perfect match -- place directly
    sellingPlayer.assignedPos = autoSlot;
    sellingPlayer.adjustedRating = calculateRating(sellingPlayer, autoSlot);
    sellingPlayer.chemBonus = 0;
    buyer.squad.push(sellingPlayer);
    recalculateChemistry(buyer);
    alert(sellingPlayer.name + ' has been added to Player ' + buyerId + "'s squad at " + getDisplayLabel(autoSlot) + '!');
    updateTurnInfo();
    renderSquad();
    nextTurn();
  } else {
    // No matching open slot -- show position picker for the buyer
    const freeSlots = buyerSlots.filter(slot => !filledBuyer.includes(slot));
    if (freeSlots.length === 0) {
      // Buyer's squad is full -- just add with a temp pos (edge case)
      sellingPlayer.assignedPos = 'BENCH';
      buyer.squad.push(sellingPlayer);
      recalculateChemistry(buyer);
      updateTurnInfo();
      renderSquad();
      nextTurn();
      return;
    }
    // Store context and show the modal
    pendingTrade = { buyer, seller, freeSlots };
    const modal = document.getElementById('trade-assign-modal');
    document.getElementById('trade-player-name').textContent = sellingPlayer.name + ' (' + sellingPlayer.position + ')';
    const sel = document.getElementById('trade-assign-pos');
    sel.innerHTML = '<option value="">-- Choose a slot --</option>' +
      freeSlots.map(slot => '<option value="' + slot + '">' + getDisplayLabel(slot) + '</option>').join('');
    modal.classList.remove('hidden');
    alert('Pass the device to Player ' + buyerId + ' to choose where to place ' + sellingPlayer.name + '.');
  }
});

document.getElementById('trade-assign-confirm').addEventListener('click', () => {
  const chosenSlot = document.getElementById('trade-assign-pos').value;
  if (!chosenSlot) { alert('Please choose a position!'); return; }

  const { buyer } = pendingTrade;
  sellingPlayer.assignedPos = chosenSlot;
  sellingPlayer.adjustedRating = calculateRating(sellingPlayer, chosenSlot);
  sellingPlayer.chemBonus = 0;
  buyer.squad.push(sellingPlayer);
  recalculateChemistry(buyer);

  document.getElementById('trade-assign-modal').classList.add('hidden');
  pendingTrade = null;
  updateTurnInfo();
  renderSquad();
  nextTurn();
});

document.getElementById('reject-bid').addEventListener('click', () => {
  document.getElementById('sell-interface').classList.add('hidden');
  document.getElementById('accept-section').classList.add('hidden');
  hideCard();
  showPositionSelect();
});

// ─── Check turn end ───────────────────────────────────────────────────────────

function checkTurnEnd() {
  const player = gameState.players[currentPlayer - 1];

  if (player.squad.length >= 11) {
    if (!player.captain) {
      document.getElementById('captain-dropdown').innerHTML =
        player.squad.map(p => `<option value="${p.name}">${p.name} (${p.adjustedRating})</option>`).join('');
      document.getElementById('captain-select').classList.remove('hidden');
    } else {
      nextTurn();
    }
  } else {
    showPositionSelect();
  }
}

// ─── Set captain ──────────────────────────────────────────────────────────────

document.getElementById('set-captain').addEventListener('click', () => {
  const captainName = document.getElementById('captain-dropdown').value;
  const player = gameState.players[currentPlayer - 1];
  player.captain = player.squad.find(p => p.name === captainName);
  // Apply captain +2 boost
  recalculateChemistry(player);
  renderSquad();
  document.getElementById('captain-select').classList.add('hidden');
  nextTurn();
});

// ─── Next turn ────────────────────────────────────────────────────────────────

function nextTurn() {
  // Check if ALL players have full squads & captains
  const allDone = gameState.players.every(p => p.squad.length >= 11 && p.captain);
  if (allDone) { endGame(); return; }

  // Advance to next player who still needs to do something
  let tries = 0;
  do {
    currentPlayer = (currentPlayer % numPlayers) + 1;
    tries++;
    if (tries > numPlayers) { endGame(); return; }
  } while (
    gameState.players[currentPlayer - 1].squad.length >= 11 &&
    gameState.players[currentPlayer - 1].captain
  );

  startTurn();
}

document.getElementById('next-turn').addEventListener('click', nextTurn);

// ─── End game ─────────────────────────────────────────────────────────────────

function endGame() {
  document.getElementById('game-area').classList.add('hidden');
  document.getElementById('game-end').classList.remove('hidden');
  calculateScores();
  setupVoting();
}

function calculateScores() {
  gameState.players.forEach(player => {
    recalculateChemistry(player);
    const totalRating = player.squad.reduce((s, p) => s + p.adjustedRating, 0);
    const chemistry   = player.squad.reduce((s, p) => s + (p.chemBonus || 0), 0);
    const avgRating   = totalRating / 11;
    const captainBoost = player.captain ? 2 : 0;
    const budgetPenalty = player.budget / 10;
    player.score      = avgRating + captainBoost - budgetPenalty;
    player.totalChem  = chemistry;
    player.avgRating  = avgRating;
  });
}

// ─── Build a mini-pitch HTML for one manager ─────────────────────────────────
function buildMiniPitch(manager) {
  const isDefend = manager.formation === 'defend';

  // Rows: attack top → GK bottom
  const rows = isDefend
    ? [['LW','ST','RW'], ['CM1','CDM','CM2'], ['LB','CB1','CB2','RB'], ['GK']]
    : [['LW','ST','RW'], ['CAM'],             ['CM1','CM2'],           ['LB','CB1','CB2','RB'], ['GK']];

  function posDisplayLabel(slotKey) {
    if (slotKey === 'CDM') return 'DM';
    return slotKey.replace(/\d+$/, '');
  }

  function slotHtml(slotKey) {
    const footballer = manager.squad.find(p => p.assignedPos === slotKey);
    const isCaptain  = footballer && manager.captain && manager.captain.name === footballer.name;
    const posLabel   = posDisplayLabel(slotKey);
    if (!footballer) {
      return '<div class="mp-pos mp-empty"><span class="mp-pos-label">' + posLabel + '</span></div>';
    }
    const parts    = footballer.name.split(' ');
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : parts[0];
    const display  = lastName.length > 9 ? lastName.substring(0, 8) + '\u2026' : lastName;
    const rating   = footballer.adjustedRating;
    const cls      = rating >= 92 ? 'mp-gold' : rating >= 88 ? 'mp-silver' : 'mp-bronze';
    return '<div class="mp-pos ' + cls + (isCaptain ? ' mp-captain' : '') + '">' +
      (isCaptain ? '<span class="mp-armband">C</span>' : '') +
      '<span class="mp-pos-label">' + posLabel + '</span>' +
      '<span class="mp-name">' + display + '</span>' +
      '<span class="mp-rating">' + rating + '</span>' +
    '</div>';
  }

  const rowsHtml = rows.map(row =>
    '<div class="mp-row">' + row.map(slotHtml).join('') + '</div>'
  ).join('');

  // Portrait pitch SVG — top = attack, bottom = GK
  const pitchLines =
    '<div class="pitch-lines">' +
    '<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">' +
      '<rect x="10" y="10" width="280" height="400" fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="1.5" rx="3"/>' +
      '<line x1="10" y1="210" x2="290" y2="210" stroke="rgba(255,255,255,0.13)" stroke-width="1.2"/>' +
      '<circle cx="150" cy="210" r="40" fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="1.2"/>' +
      '<circle cx="150" cy="210" r="3" fill="rgba(255,255,255,0.22)"/>' +
      '<rect x="65" y="10" width="170" height="70" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>' +
      '<rect x="105" y="10" width="90" height="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>' +
      '<rect x="120" y="2" width="60" height="12" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>' +
      '<rect x="65" y="340" width="170" height="70" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>' +
      '<rect x="105" y="382" width="90" height="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>' +
      '<rect x="120" y="406" width="60" height="12" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>' +
    '</svg>' +
    '</div>';

  return '<div class="mini-pitch">' + pitchLines + '<div class="mp-rows">' + rowsHtml + '</div></div>';
}

function setupVoting() {
  // ── Squad preview (all managers, unsorted) ──
  const previewHtml = gameState.players.map(p => {
    const formation = p.formation === 'defend' ? '4-3-3 Defend' : '4-3-3 Attack';
    const captainName = p.captain ? p.captain.name : '—';
    return `<div class="squad-card voting-squad-card">
      <div class="squad-card-header">
        <div>
          <div class="squad-manager">Manager ${p.id}</div>
          <div class="squad-meta">${formation} &nbsp;·&nbsp; &#127894; ${captainName}</div>
        </div>
        <div class="squad-pts" style="font-size:14px;color:#94a3b8;">Avg &#11088; ${(p.squad.reduce((s,pl)=>s+pl.adjustedRating,0)/11).toFixed(1)}</div>
      </div>
      ${buildMiniPitch(p)}
      <div class="squad-player-list">
        ${p.squad.map(pl => {
          const isCaptain = p.captain && p.captain.name === pl.name;
          return `<div class="spl-row">
            <span class="spl-pos">${pl.assignedPos ? pl.assignedPos.replace(/\d+$/,'') : '?'}</span>
            <span class="spl-name">${pl.name}${isCaptain ? ' &#127894;' : ''}</span>
            <span class="spl-club">${pl.club}</span>
            <span class="spl-rating">${pl.adjustedRating}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');

  document.getElementById('voting-squads').innerHTML = previewHtml;

  // ── Vote selects ──
  const voteList = document.getElementById('vote-list');
  voteList.innerHTML = gameState.players.map(voter =>
    `<div class="vote-row">
      <label>Manager ${voter.id} votes for:</label>
      <select class="vote-select" data-voter="${voter.id}">
        ${gameState.players.filter(p => p.id !== voter.id)
          .map(p => `<option value="${p.id}">Manager ${p.id}</option>`).join('')}
      </select>
    </div>`
  ).join('');
}

document.getElementById('submit-all-votes').addEventListener('click', () => {
  document.querySelectorAll('.vote-select').forEach(select => {
    const votedFor = parseInt(select.value);
    gameState.players.find(p => p.id === votedFor).votes++;
  });
  gameState.players.forEach(p => p.score += p.votes * 2);
  document.getElementById('voting-phase').classList.add('hidden');
  document.getElementById('final-results').classList.remove('hidden');
  displayFinalScores();
});

const MEDALS = ['🥇','🥈','🥉'];

function displayFinalScores() {
  const sorted = [...gameState.players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  // ── Winner banner ──
  document.getElementById('winner-banner').innerHTML = `
    <div class="winner-crown">👑</div>
    <div class="winner-name">Manager ${winner.id} Wins!</div>
    <div class="winner-score">${winner.score.toFixed(2)} pts</div>
  `;

  // ── Leaderboard ──
  document.getElementById('leaderboard').innerHTML = sorted.map((p, i) => {
    const medal = MEDALS[i] || `${i+1}.`;
    const isWinner = i === 0;
    const formation = p.formation === 'defend' ? '4-3-3 Defend' : '4-3-3 Attack';
    return `
    <div class="lb-row${isWinner ? ' lb-winner' : ''}">
      <span class="lb-medal">${medal}</span>
      <span class="lb-label">Manager ${p.id}</span>
      <span class="lb-formation">${formation}</span>
      <div class="lb-stats">
        <span class="lb-stat">⭐ ${p.avgRating.toFixed(1)}</span>
        <span class="lb-stat">⚗️ ${p.totalChem}</span>
        <span class="lb-stat">💰 $${p.budget}M left</span>
        <span class="lb-stat">🗳️ ${p.votes} votes</span>
      </div>
      <span class="lb-total">${p.score.toFixed(2)}</span>
    </div>`;
  }).join('');

  // ── Squad cards ──
  document.getElementById('squad-showcase').innerHTML = sorted.map((p, i) => {
    const medal = MEDALS[i] || '';
    const formation = p.formation === 'defend' ? '4-3-3 Defend' : '4-3-3 Attack';
    const captainName = p.captain ? p.captain.name : '—';
    return `
    <div class="squad-card${i === 0 ? ' squad-card-winner' : ''}">
      <div class="squad-card-header">
        <span class="squad-medal">${medal}</span>
        <div>
          <div class="squad-manager">Manager ${p.id}</div>
          <div class="squad-meta">${formation} &nbsp;·&nbsp; 🎖 ${captainName}</div>
        </div>
        <div class="squad-pts">${p.score.toFixed(2)}<span class="squad-pts-label">pts</span></div>
      </div>
      ${buildMiniPitch(p)}
      <div class="squad-player-list">
        ${p.squad.map(pl => {
          const isCaptain = p.captain && p.captain.name === pl.name;
          return `<div class="spl-row">
            <span class="spl-pos">${pl.assignedPos ? pl.assignedPos.replace(/\d+$/,'') : '?'}</span>
            <span class="spl-name">${pl.name}${isCaptain ? ' 🎖' : ''}</span>
            <span class="spl-club">${pl.club}</span>
            <span class="spl-rating">${pl.adjustedRating}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}