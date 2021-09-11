const attackValue = 10;
const monsterAtkValue = 14;
const strongAtkValue = 18;
const healValue = 20;
const attack = "ATTACK";
const strongAttack = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt('Enter a maximum Life for You & Monster!', '100');

let maxLife = parseInt(enteredValue);

if (isNaN(maxLife) || maxLife <= 0){
  maxLife = 100;
  alert('You entered an invalid input, taking default value 100.')
}

let currentMonsterHealth = maxLife;
let currentPlayerHealth = maxLife;
let eventLog = [];

const attackBtn = document.getElementById("attack-btn");
const strongAtkBtn = document.getElementById("strong-attack-btn");
const healbtn = document.getElementById("heal-btn");
const monsterHealthBar = document.getElementById("monster");
const playerHealthBar = document.getElementById("player");
const oneUp = document.getElementById("oneup");
const logbtn = document.getElementById('log-button');

adjustHealthBars(maxLife);

function adjustHealthBars(maxLife) {
  monsterHealthBar.max = maxLife;
  monsterHealthBar.value = maxLife;
  playerHealthBar.max = maxLife;
  playerHealthBar.value = maxLife;
  currentPlayerHealth = maxLife;
  currentMonsterHealth = maxLife; 
}

function dealMonsterDamage(damage) {
  const dealtDamage = Math.random() * damage;
  monsterHealthBar.value = monsterHealthBar.value - dealtDamage;
  return dealtDamage;
}

function dealPlayerDamage(damage) {
  const dealtDamage = Math.random() * damage;
  playerHealthBar.value = playerHealthBar.value - dealtDamage;
  return dealtDamage;
}

function ogAttack(mode) {
  if (mode === attack) {
    const damage = dealMonsterDamage(attackValue);
    const playerDamage = dealPlayerDamage(monsterAtkValue);
    currentMonsterHealth -= damage;
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_PLAYER_ATTACK,damage,currentMonsterHealth,currentPlayerHealth);
  } else if (mode === strongAttack) {
    const strongAttackDamage = dealMonsterDamage(strongAtkValue);
    const playerDamage = dealPlayerDamage(attackValue);
    currentMonsterHealth -= strongAttackDamage;
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_PLAYER_STRONG_ATTACK,strongAttackDamage,currentMonsterHealth,currentPlayerHealth);
  }
  results();
}

function attackHandler() {
  ogAttack(attack);
}

function strongAttackHandler() {
  ogAttack(strongAttack);
}

function healPlayer() {
  if (playerHealthBar.value < 80) {
    playerHealthBar.value += healValue;
    currentPlayerHealth = healValue;
    const playerDamage = dealPlayerDamage(attackValue);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
  } else if (playerHealthBar.value >= 80) {
    alert("You can't heal yourself more than 80 health points.");
  }
}

function results() {
  if(currentPlayerHealth > 0 && currentMonsterHealth <= 0 ){
    alert('You Won!');
    writeToLog(LOG_EVENT_GAME_OVER, 'Player Won', currentMonsterHealth, currentPlayerHealth);
    reset();
  } else if(currentMonsterHealth > 0 && currentPlayerHealth <= 0 ){
    oneUpLife();
  } else if(currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ){
    alert("It's a Draw!");
    writeToLog(LOG_EVENT_GAME_OVER, 'A Draw', currentMonsterHealth,currentPlayerHealth);
    reset();
  }
}

function oneUpLife() {
  if (currentMonsterHealth > 0 && currentPlayerHealth <= 0 && oneUp.textContent == 1){
    alert("You Lose, OneUP Consumed & got another chance to Kill Monster!")
    playerHealthBar.value = 40;
    currentPlayerHealth = 40;
    oneUp.textContent = 0;
    writeToLog(LOG_EVENT_GAME_OVER, 'Player Got Another chance Onup has been used!', currentMonsterHealth,currentPlayerHealth);
  }
  else if( currentMonsterHealth > 0 && currentPlayerHealth <= 0 && oneUp.textContent == 0 ){
    alert('You Lose, Monster Won!');
   writeToLog(LOG_EVENT_GAME_OVER, 'Monster Won', currentMonsterHealth,currentPlayerHealth);
    reset();
  }
}

function reset() {
  adjustHealthBars(maxLife);
  oneUp.textContent = 1;
}

function writeToLog(event, value, monsterHealth, playerHealth){
  let logs = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth:  playerHealth
  }
  if (event === LOG_EVENT_PLAYER_ATTACK){
    logs.target = 'Monster';

  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK){
    logs.target = 'Monster';
   
  } else if (event === LOG_EVENT_MONSTER_ATTACK){
    logs.target = 'Player';

  } else if(event === LOG_EVENT_PLAYER_HEAL){
    logs.target= 'Player';

  }
  eventLog.push(logs);
}

function printLogHandler() {
  console.log(eventLog);
}



attackBtn.addEventListener("click", attackHandler);
strongAtkBtn.addEventListener("click", strongAttackHandler);
healbtn.addEventListener("click", healPlayer);
logbtn.addEventListener("click", printLogHandler);
