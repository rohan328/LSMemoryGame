//Global Variables
var pattern = [2, 6, 4, 5, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

//global consts
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;


function startGame() {
  //set game state
  progress = 0;
  gamePlaying = true;
  newPattern();

  //swap buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
}

function newPattern(){
  for(let i=0;i<pattern.length;i++){
    pattern[i]=Math.floor(Math.random() * 6)+1;
    console.log(pattern[i]);
  }
}

function stopGame() {
  //set game state
  gamePlaying = false;

  //swap buttons
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

//light the button
function lightButton(btn){
  document.getElementById("btn"+btn).classList.add("lit");
}


//clear the button
function clearButton(btn){
  document.getElementById("btn"+btn).classList.remove("lit");
}

//play a single clue
function playClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime;
  for(let i=0;i<=progress;i++){
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying) return;
  
  
  if(pattern[guessCounter] == btn){
    if(guessCounter==progress){
      if(progress == pattern.length-1) winGame();
      else{
        progress++;
        playClueSequence();
      }
    }
    else guessCounter++;
  }
  else loseGame();
  
}


function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Congrats! You won!");
}



// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500,
  6: 533
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)