// All game logic is in this script

let game = { // All variables for the game state
    chipVariants: {}, // Which variants are selected for each color
    seed: null,    // Seed (unused)
    actionLog: [], // Text log of actions
    roundCount: 1, // Which round it is
    prevBuy: { gold: 0, chips: [] }, // Amount of gold and chips purchased in previous shop phase
    dropletStats: { color:'droplet', value:1 }, // Stats of the droplet, can be upgraded
    ratStats: { color:'rat', value:2 },         // Stats of rat tails, set at the start of each round
    isPotionFull: true, // If the potion is available
};
let chipsOwned = [...starterChips]; // Chips in bag at start of game, added to in shop phase
let chipsInBag = [...starterChips]; // Chips in bag at start of each round, chips removed as they are drawn
let totalWhite = 0;    // Current total of white chips placed
let totalWhiteMax = 7; // Maximum total of white chips without busting (usually 7)
let chipsRedAside = []; // List of Red B chips, to be placed at end of round, or saved until next round
let chipCost = {}; // Chip costs of the selected variants: [color][value]
let chipDesc = {}; // Chip descriptions of the selected variants: [color][value]
game.chipVariants = { green:'C', red:'B', blue:'A', yellow:'C', orange:'A', black:'A', purple:'B', white:'A' };
for (const color in game.chipVariants) { // List the chip costs of only the selected variants
    const variant = game.chipVariants[color];
    chipCost[color] = allVariants.cost[color][variant];
    chipDesc[color] = allVariants.desc[color][variant];
}

const trackActual = document.getElementById('trackActual') // The actual track, has attributes: { elements, currIndex, currElem, placed }
function initializeTrack(track = trackActual) {
    track.innerHTML = '';
    track.elements = spaceValues.map((val,i) => { // Elements for board spaces
        const newSpace = document.createElement('div');
        newSpace.gold = val[0];  newSpace.VP = val[1];  newSpace.ruby = val[2];
        setElementToTrackSpace(newSpace);  track.appendChild(newSpace);
        return newSpace;
    });
    track.currIndex = 0; // Index of the furthest space a chip is placed
    track.currElem = track.elements[0]; // Element of furthest chip space
    track.placed = []; // List of chips currently placed on the track
    placeChip(game.dropletStats, track, false);
    if (game.ratStats.value) {
        placeChip(game.ratStats, track, false);
    }
}
function setElementToTrackSpace(elem = trackActual.currElem) {
    elem.className = 'trackSpace';
    const rubyElem = elem.ruby ? '<img src="ui/ruby.png" class="trackRuby">' : '';
    elem.innerHTML = `${rubyElem}<div class="trackGold">${elem.gold}</div><div class="trackVP">${elem.VP}</div>`;
    elem.style.background = '';
}
function setElementToChip(elem, chip, mult=null, ruby=0) {
    elem.className = 'chip';
    const value = (['rat','droplet'].includes(chip.color) ? '' : (chip.value || ''));
    elem.style.backgroundImage = `url("chips/${chip.color}${value}.png")`;
    elem.innerHTML = '';
    if (ruby) elem.innerHTML += '<img src="ui/ruby.png" class="trackRuby">';
    const effMult = chip?.mult ?? mult;
    if (effMult != null) elem.innerHTML += `<div class="overlayChipText outlineText">×${effMult}</div>`;
}

function loadGameState() {
    game = loadFromStorage("gameState") ?? game;
    chipsOwned = loadFromStorage("savedOwnedChips") ?? chipsOwned;
    chipsInBag = [...chipsOwned];
    chipsRedAside = loadFromStorage("savedRedAside") ?? [];
    chipsRedAside.forEach(c => chipsInBag.splice(chipsInBag.findIndex(chip => chip.color==c.color && chip.value==c.value), 1));
    initializeTrack(); // Reset the track, and re-place every chip
    const savedPlacedChips = loadFromStorage("savedPlacedChips") ?? [];
    savedPlacedChips.forEach((c,i) => { // After loading, placed chips are not linked to bag chips, must search bag for each
        const [chip] = chipsInBag.splice(chipsInBag.findIndex(chip => chip.color==c.color && chip.value==c.value), 1);
        // placeChip(chip, trackActual, (i==savedPlacedChips.length-1)); // set isReal to true on last chip?
        placeChip(chip, trackActual, false);
    });
    updateWhiteCount();
    initializePhysics();
}
function loadFromStorage(key) {
  if (localStorage.getItem(key) !== null) return JSON.parse(localStorage.getItem(key));
}
function saveGameState() { // Make sure blue peeking is the same after reload!!!!!!!!! and delayed reds!
    localStorage.setItem("gameState",JSON.stringify(game));
    // Save chips that are owned or placed, but only the color and value
    const savedOwnedChips = chipsOwned.map(c => { return {color:c.color,value:c.value}; });
    localStorage.setItem("savedOwnedChips",JSON.stringify(savedOwnedChips));
    const savedRedAside = chipsRedAside.map(c => { return {color:c.color,value:c.value}; });
    localStorage.setItem("savedRedAside",JSON.stringify(savedRedAside));
    const savedPlacedChips = trackActual.placed.filter(c => !['rat','droplet'].includes(c.color)).map(c => { return {color:c.color,value:c.value}; });
    localStorage.setItem("savedPlacedChips",JSON.stringify(savedPlacedChips));
    console.log('saved game');
}

function regularPull() {
    if (document.querySelector(".splash-overlay")) return; // Can't pull if there is an overlay
    const [grabbedChip] = grabChipFromBag()
    const chip = removeChipFromBag(grabbedChip);
    placeChip(chip);
}
function grabChipFromBag(multiDraw = 1) {
    if (chipsInBag.length === 0 || totalWhite > totalWhiteMax || trackActual.currIndex == trackActual.elements.length-2) return [];
    const arr = [...chipsInBag.keys()]; // [0,1,2,...]
    arr.forEach((_, i) => { const j = Math.floor(Math.random() * (i + 1));  [arr[i], arr[j]] = [arr[j], arr[i]] }); // Fisher-Yates shuffle
    return arr.slice(0, multiDraw).map(i => chipsInBag[i]); // Return array of chips
}
function removeChipFromBag(chip) {
    if (chip == undefined) return;
    chipsInBag = chipsInBag.filter(c => c != chip); // Remove chip from current bag
    if (chip.body) {
        Matter.Composite.remove(world, chip.body); // Remove physics chip from world
        createShockwave(chip.body, 150, 0.04);
    }
    if (chip.color == 'red' && game.chipVariants.red == 'B') { triggerRedAside(chip); return; }
    writeToLog(`Placed ${chip.color} ${chip.value}-chip`);
    return chip;
}
function placeChip(chip, track = trackActual, isReal = true) {
    if (chip == undefined) return;
    if (track != trackActual) isReal = false;
    if (track.currIndex == track.elements.length-2) return;
    let spaces = chip.value;  const prevChip = track.placed[track.placed.length-1];
    // Do chip effects that increase the number of spaces
    if (chip.color == 'yellow' && game.chipVariants.yellow == 'A' && prevChip?.color == 'white' && isReal) triggerYellowReturnWhite();
    if (game.chipVariants.yellow == 'C' && prevChip?.color == 'yellow') spaces *= 2;
    if (chip.color == 'red' && game.chipVariants.red == 'A' && track.placed.filter(c => c.color=='orange').length > 0) spaces += 1;
    if (chip.color == 'red' && game.chipVariants.red == 'A' && track.placed.filter(c => c.color=='orange').length > 2) spaces += 1;
    if (chip.color == 'red' && game.chipVariants.red == 'C' && prevChip?.color == 'white') spaces += prevChip?.value;
    if (chip.color == 'white' && game.chipVariants.red == 'D' && chip.value == 1 && track.placed.filter(c => c.color == 'red').length) spaces += 1;
    // Render the chip onto the track space
    track.placed.push(chip);
    track.currIndex = Math.min(track.elements.length-2, track.currIndex+spaces);
    updateTrackGlow(track);
    setElementToChip(track.currElem, chip, null, track.currElem.ruby);
    if (isReal) {
        console.log('real place');
        updateWhiteCount();
        saveGameState();
    }
    // Do chips effects that resolve after the chip is placed
    if (chip.color == 'blue' && game.chipVariants.blue == 'C' && track.currElem.ruby && isReal) awardVPR(0,1,chip);
    if (chip.color == 'blue' && game.chipVariants.blue == 'D' && track.currElem.ruby && isReal) awardVPR(chip.value,0,chip);
    if (chip.color == 'purple' && game.chipVariants.purple == 'C' && track.currElem.gold >= 10 && isReal) awardVPR(Math.floor(track.currElem.gold/10),0,chip);
    if (chip.color == 'blue' && game.chipVariants.blue == 'A' && isReal) console.log('blue place');
    if (chip.color == 'blue' && game.chipVariants.blue == 'A' && isReal) triggerBluePeek(chip.value);
}
function updateTrackGlow(track = trackActual) {
    track.currElem = track.elements[track.currIndex];
    track.elements.forEach(e => e.classList.remove("track-glow"));
    track.elements[track.currIndex+1].classList.add("track-glow");
    track.currElem.scrollIntoView({behavior: "smooth", inline: "center"});
}
function triggerBluePeek(value) { // Peek at multiple chips, and you may place one
    writeToLog(`Blue effect peeked at ${value} chips`, chipColors.blue);
    saveGameState();
    showSelectorSplash({
        title: "Blue Effect",
        message: "You may place 1 chip in your pot",
        confirmText: "Place",
        holdToConfirm: false,
        chipsToSelect: [grabChipFromBag(value)],
        maxSelect: 1,
        showGold: false,
        showTrack: true,
        onConfirm: (selectedChips) => placeChip(removeChipFromBag(selectedChips[0])) // Place selected chip
    });
}
function triggerYellowReturnWhite() {
    setElementToTrackSpace(trackActual.currElem);
    const [chip] = trackActual.placed.splice(trackActual.placed.length-2,1);
    writeToLog(`Yellow effect returned ${chip.color} ${chip.value}-chip`, chipColors.yellow);
    chip.body = spawnChip(chip.color, chip.value)
    chipsInBag.push(chip);
}
function triggerRedAside(chip) {
    chipsRedAside.push(chip);
    const newChip = quickChipElement(chip);
    newChip.style.margin = '5px auto';
    showConfirmSplash({
        title: `Red Chip Saved For Later`,
        message: newChip.outerHTML,
        cancelText: "",
        confirmText: "Ok",
    });
    saveGameState();
}
function awardVPR(VP = 0, ruby = 0, chip = null) {
    const newChip = quickChipElement(chip);
    if (chip.color == 'blue') newChip.innerHTML = '<img src="ui/ruby.png" class="trackRuby">';
    newChip.style.margin = '5px auto';
    const textChip = chip ? `${newChip.outerHTML}` : '';
    const textVP = VP ? `You get ${VP} Victory Points!` : '';
    const textRuby = ruby ? `You get a ruby!` : '';
    showConfirmSplash({
        title: `${textVP}${textVP&&textRuby?'<br>':''}${textRuby}`,
        message: textChip,
        cancelText: "",
        confirmText: "Ok",
    });
}

function usePotion() {
    if ( trackActual.placed.length && game.isPotionFull && totalWhite <= totalWhiteMax
         && !['rat','droplet'].includes(trackActual.placed[trackActual.placed.length-1].color) ) {
        const lastChip = quickChipElement(trackActual.placed[trackActual.placed.length-1]);
        lastChip.style.margin = '5px auto';
        const textChip = lastChip.outerHTML;
        showConfirmSplash({
            title: `Use Potion?`,
            message: textChip,
            cancelText: "Go Back",
            confirmText: "Use Potion",
            onConfirm: () => { // Put chip back into bag, and reset the track space
                const chip = removeLastChip(trackActual);
                chip.body = spawnChip(chip.color, chip.value)
                chipsInBag.push(chip);
                writeToLog(`Used potion on ${chip.color} ${chip.value}-chip`);
                updateWhiteCount();
                game.isPotionFull = false;
            },
        });
    }
}
function removeLastChip(track = trackActual) {
    setElementToTrackSpace(track.currElem);
    track.currIndex = track.elements.map(e => e.className).lastIndexOf("chip");
    updateTrackGlow(track);
    return track.placed.pop();
}
function updateWhiteCount() {
    const newTotal = trackActual.placed.filter(c => c.color === 'white').reduce((sum, c) => sum + c.value, 0);
    if (newTotal != totalWhite) {
        totalWhite = newTotal;
        whiteCounter.innerHTML = `${totalWhite}/${totalWhiteMax}`;
        const odds = Math.ceil(chipsInBag.filter(c => c.color === 'white').reduce((canBust, c) => canBust + ((c.value + totalWhite) > totalWhiteMax), 0)/chipsInBag.length*100);
        if (odds) whiteCloud.classList.add('cloud-vibrate'); else whiteCloud.classList.remove('cloud-vibrate');
        if (totalWhite > totalWhiteMax) {
            writeToLog(`Pot exploded with ${totalWhite} white chips!`,chipColors.red);
            whiteCloud.classList = 'cloud-burst';
            setTimeout(() => { createBustForce(); }, 1200); 
            drawBtn.innerHTML = 'BUST!';
        } else {
            drawBtn.innerHTML = 'Draw Chip';
            whiteCloud.src = "ui/cloud.png";
            whiteCloud.classList.remove('cloud-pulse');  void whiteCloud.offsetWidth;  whiteCloud.classList.add('cloud-pulse');
        };
    }
}
// function shakeScreen(duration = 500, intensity = 10) {
//     const container = document.getElementById("mainContainer"); // Or the canvas parent
//     const start = performance.now();
//     function animate(time) {
//         const elapsed = time - start;
//         const effIntensity = intensity * (1 - elapsed/duration);
//         if (elapsed < duration) {
//             // random offset each frame
//             const x = (Math.random() * 2 - 1) * effIntensity;
//             const y = (Math.random() * 2 - 1) * effIntensity;
//             container.style.transform = `translate(${x}px, ${y}px)`;
//             requestAnimationFrame(animate);
//         } else {
//             // Reset transform
//             container.style.transform = "";
//         }
//     }
//     requestAnimationFrame(animate);
// }

function writeToLog(actionString, color = "white") {
    const now = new Date();
    let timeString = now.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    timeString = timeString.replace(/\s?[AP]M/i, ''); // remove AM/PM
    game.actionLog.push([timeString,actionString,color]);
}
function showConfirmSplash({
    title = "",
    message = "",
    cancelText = "Cancel",
    confirmText = "",
    onConfirm = () => {},
    holdToConfirm = false,
}) {
    const overlay = quickElement("div","splash-overlay");
    const box = quickElement("div","splash-box");
    const titleElem = quickElement("h2","splash-title",title);
    const msgElem = quickElement("p","splash-message",message)
    const btnRow = quickElement("div","splash-buttons-row");
    const cancelBtn = createButton({
        buttonText: cancelText,
        buttonColor: chipColors.blue,
        onClick: () => document.body.removeChild(overlay)
    });
    const confirmBtn = createButton({
        buttonText: confirmText,
        onClick: () => {
            document.body.removeChild(overlay);
            onConfirm();
        },
        holdToClick: holdToConfirm
    });

    if (title) box.appendChild(titleElem);
    if (message) box.appendChild(msgElem);
    if (cancelText) btnRow.appendChild(cancelBtn);
    if (confirmText) btnRow.appendChild(confirmBtn);
    
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    if (title.includes('Log')) msgElem.scrollTop = msgElem.scrollHeight;
}
function showSelectorSplash({
    title = "",
    message = "",
    confirmText = "Buy",
    onConfirm = () => {},
    holdToConfirm = false,
    chipsToSelect = null,
    maxSelect = 2,
    gold = 999,
    showGold = true,
    showTrack = false,
    showDesc = false,
}) {
    let selectedChips = [];
    const overlay = quickElement("div","splash-overlay");
    const box = quickElement("div","splash-box");
    const titleElem = quickElement("h2","splash-title",title);
    const msgElem = quickElement("p","splash-message",message)
    const btnRow = quickElement("div","splash-buttons-row");
    const confirmBtn = createButton({
        buttonText: "Skip",
        onClick: () => {
            document.body.removeChild(overlay);
            onConfirm(selectedChips);
        },
        holdToClick: holdToConfirm
    });
    confirmBtn.updateText = (numSelected) => { 
        if (numSelected == 0) confirmBtn.firstChild.textContent = "Skip";
        if (numSelected != 0) confirmBtn.firstChild.textContent = `${confirmText} ${numToText(numSelected)}`;
        if (confirmText == "Return to Game") confirmBtn.firstChild.textContent = "Return to Game";
    };
    confirmBtn.updateText(selectedChips.length);

    // Preview track
    const track = quickElement('div','track');
    track.style.margin = "0px -20px 18px";
    initializeTrack(track);
    trackActual.placed.filter(c => !['rat','droplet'].includes(c.color)).forEach(c => placeChip(c, track));
    function updatePreviewTrack(chipToRemove = null) { // Update the preview track when a chip is selected/unselected
        if (showTrack) {
            initializeTrack(track); // Clear the track
            trackActual.placed.filter(c => !['rat','droplet'].includes(c.color)).forEach(c => placeChip(c, track));
            selectedChips = selectedChips.filter(x => x !== chipToRemove);
            selectedChips.forEach(c => placeChip(c, track)); // Re-place all the chips on the track
            console.log(selectedChips);
        }
    }

    if (showTrack) box.appendChild(track);
    if (title) box.appendChild(titleElem);
    if (message) box.appendChild(msgElem);

    // Rules display
    const DescContainer = quickElement("div","shop-desc")
    const chipDescElem = quickChipElement({color:'blank'});
    const chipDescText = quickElement("div","shop-desc-text","Click on a chip to see its description.");
    DescContainer.appendChild(chipDescElem);
    DescContainer.appendChild(chipDescText);
    if (showDesc) box.appendChild(DescContainer);
    function updateDescDisplay(chip) {
        if (showDesc) {
            setElementToChip(chipDescElem, chip);
            let effValue = ( chip.value in chipDesc[chip.color] ? chip.value : 0 );
            if (chip.color == 'purple') effValue = chip?.mult ?? 0;
            chipDescText.innerHTML = chipDesc[chip.color][effValue];
        }
    }
    
    const chipList = quickElement("div","chip-selector");
    chipsToSelect.forEach(thisBuyRow => {
        const chipRow = quickElement("div","chip-selector-row");

        thisBuyRow.forEach(chip => {
            const itemDiv = quickElement("div","chip-selector-item");
            const chipElem = quickChipElement(chip);
            itemDiv.appendChild(chipElem);
            
            const cost = chipCost[chip.color][chip.value ?? 1];
            const goldIcon = quickElement("div","trackGold",cost);
            if (showGold) itemDiv.appendChild(goldIcon)

            chipRow.appendChild(itemDiv);
            itemDiv.addEventListener("click", () => {
                updateDescDisplay(chip);
                if (selectedChips.includes(chip)) { // Unselect
                    selectedChips = selectedChips.filter(x => x !== chip);
                    itemDiv.classList.remove("selected");
                    updatePreviewTrack(chip);
                } else { // Select if possible
                    if (maxSelect == 1) { // Swap single selection
                        if (cost > gold) {
                            flashRed(itemDiv);
                        } else {
                            chipList.querySelectorAll('.chip-selector-item').forEach(e => e.classList.remove('selected'));
                            selectedChips = [chip];
                            itemDiv.classList.add("selected");
                            updatePreviewTrack();
                        }
                    } else if ( (selectedChips.length >= maxSelect) // Limit amount
                        || (cost + selectedChips.reduce((sum, c) => sum + chipCost[c.color][c.value], 0) > gold) // Need enough gold
                        || (selectedChips.some(c => c.color == chip.color) && maxSelect == 2) ) { // Can't buy same color
                            flashRed(itemDiv);
                    } else { // Add chip to selected
                        selectedChips.push(chip);
                        itemDiv.classList.add("selected");
                        updatePreviewTrack();
                    }
                }
                confirmBtn.updateText(selectedChips.length);
            });
        });
        chipList.appendChild(chipRow);
    });
    box.appendChild(chipList);

    btnRow.appendChild(confirmBtn);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    track.currElem.scrollIntoView({inline: "center"});
}
function numToText(num) {
    const text = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
    if (num >= text.length) return `${num} chips`;
    return `${text[num]} chip${num==1?'':'s'}`;
}
function createButton({
    buttonText = "OK",
    buttonColor = chipColors.orange,
    onClick = () => {},
    holdToClick = false
}) {
    const newButton = quickElement("button","splash-btn",buttonText);
    newButton.style.backgroundColor = buttonColor;
    if (!holdToClick) {
        newButton.addEventListener("click", e => onClick(e)); // Could check e.detail
    } else {
        const bar = quickElement("div","splash-btn-hold-bar");
        newButton.appendChild(bar);

        let interval;
        const holdDuration = 700;
        const easeOut = t => 0.3*t + 0.7*(1-Math.pow(1 - t, 3)); // cubic ease-out
        const startHold = () => {
            let start = Date.now();
            bar.style.width = "0%";
            interval = setInterval(() => {
                const elapsed = Date.now() - start;
                let t = Math.min(elapsed / holdDuration, 1);
                bar.style.width = easeOut(t) * 100 + "%";
                if (t >= 1) {
                    clearInterval(interval);
                    onClick();
                }
            }, 16);
        };
        const cancelHold = () => { clearInterval(interval); bar.style.width = "0%"; };
        newButton.addEventListener("touchstart", e => { e.preventDefault(); startHold(); }, { passive: false });
        newButton.addEventListener("touchend", cancelHold);
        newButton.addEventListener("touchmove", e => { // Manually detect if touch remains on button
                const touch = e.touches[0];
                const rect = newButton.getBoundingClientRect();
                if (!(touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom)) cancelHold();
            }, { passive: false } );
        newButton.addEventListener("mousedown", e => { e.preventDefault(); startHold(); });
        newButton.addEventListener("mouseup", cancelHold);
        newButton.addEventListener("mouseleave", cancelHold);
    }
    newButton.addEventListener("contextmenu", e => e.preventDefault());
    newButton.addEventListener("dblclick", e => e.preventDefault());
    return newButton;
}
function quickElement(type, className, innerHTML = '') {
    const newElement = document.createElement(type);
    newElement.className = className;
    newElement.innerHTML = innerHTML;
    return newElement;
}
function quickChipElement(chip, mult=null, ruby=0) {
    const newElement = document.createElement("div");
    setElementToChip(newElement, chip, mult, ruby);
    return newElement;
}
function flashRed(element) {
    element.classList.remove("flash-red"); // reset if already applied
    void element.offsetWidth;              // force reflow so animation restarts
    element.classList.add("flash-red");
}

//////////////////// vvvvvvvvvvvvv
// ========== Matter.js setup ==========

const canvas = document.getElementById("chipsCanvas");
resizeCanvasToParent(); // Initial resize (after DOM is ready)
window.addEventListener("resize", resizeCanvasToParent); // Update on window resize
const engine = Matter.Engine.create();
const world = engine.world;
engine.world.gravity.y = 1.5;
engine.enableSleeping = true;
const render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        wireframes: false,
        showSleeping: false,
        background: "ui/woodv.png",
        width: canvas.width,
        height: canvas.height,
        antiAlias: true
    }
});
const runner = Matter.Runner.create();
Matter.Render.run(render);
Matter.Runner.run(runner, engine);

let gyro = { enabled: true, lockout: false, factor: 0.25, shakeFactor: 0.5, spinFactor: 0.00005 };

function resizeCanvasToParent() { // Set the proper size for the canvas
    // Make sure parent has been laid out
    const parent = canvas.parentElement;
    const width  = parent.clientWidth;
    const height = parent.clientHeight;
    // device pixel ratio (2 for most phones, 1 for normal monitors)
    const ratio = 2; // window.devicePixelRatio || 1;
    // CSS size (visual)
    canvas.style.width  = width + "px";
    canvas.style.height = height + "px";
    // Internal resolution (render size)
    canvas.width  = width  * ratio;
    canvas.height = height * ratio;
    console.log({
        css: [width, height],
        internal: [canvas.width, canvas.height]
    });
}
window.addEventListener("devicemotion", e => {
    if (gyro.enabled) {
        let grav = e.accelerationIncludingGravity;
        const accel = e.acceleration;
        engine.world.gravity.x = -grav.x*gyro.factor - accel.x*gyro.shakeFactor;
        engine.world.gravity.y = ( gyro.lockout ? 1.5 : grav.y*gyro.factor + accel.y*gyro.shakeFactor );

        // rotationRate.gamma = rotation around Z axis (how fast user twists the phone)
        const spin = e.rotationRate?.gamma || 0;
        const spinForce = spin * gyro.spinFactor;
        const allBodies = Matter.Composite.allBodies(engine.world);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        for (const body of allBodies) {
            const dx = body.position.x - centerX;
            const dy = body.position.y - centerY;
            // Tangential vector: perpendicular to radius vector
            const tx = -dy;
            const ty = dx;
            // Normalize
            const mag = Math.sqrt(tx*tx + ty*ty);
            if (mag === 0) continue;
            const nx = tx / mag;
            const ny = ty / mag;
            // Apply force
            Matter.Body.applyForce(body, body.position, {
                x: -nx * spinForce,
                y: -ny * spinForce
            });
        }
    }
});
// if (typeof DeviceMotionEvent.requestPermission === "function") { // Request permission for gyro
//     document.getElementById("startButton").addEventListener("click", () => {
//         DeviceMotionEvent.requestPermission();
//     });
// }

Matter.Events.on(engine, "collisionStart", event => { // If moving downward, cancel collision (let it pass through)
    for (let pair of event.pairs) {                   // If moving upward, allow collision normally
        if (pair.bodyA.label === "oneWay" || pair.bodyB.label === "oneWay") {
            const other = pair.bodyA.label === "oneWay" ? pair.bodyB : pair.bodyA;
            if (other.velocity.y > 0) { // Check vertical velocity of other body
                pair.isActive = false; // Disable collision response
            }
        }
    }
});
// --- Sequential chip spawning ---
function addPhysicsChips(chips) {
    let delay = 220;
    let cumulative = 0;
    const accel = 0.92;
    chips.forEach(chip => {
        setTimeout(() => { // Only spawn if not already drawn from bag
            if (chipsInBag.includes(chip)) chip.body = spawnChip(chip.color, chip.value); 
        }, cumulative );
        delay *= accel;
        cumulative += delay;
    });
}
// --- Chip spawning ---
function spawnChip(color, value) {
    if (color=='rat' || color=='droplet') value = '';
    const radius = 64;
    const chipBody = Matter.Bodies.circle(
        Math.random() * (canvas.width - radius*2) + radius,
        -100 - Math.random() * 300,
        radius,
        {
            restitution: 0.9,
            friction: 0.3,
            frictionAir: 0.01,
            sleepThreshold: 45,
            render: {
                sprite: {
                    texture: `chips/${color}${value}.png`,
                    xScale: 1/2,
                    yScale: 1/2
                }
            }
        }
    );
    Matter.Composite.add(world, chipBody);
    return chipBody;
}
function createShockwave(originBody, radius = 400, forceMagnitude = 0.04, fallOff = true) {
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        if (body === originBody) return;
        const dx = body.position.x - originBody.position.x;
        const dy = body.position.y - originBody.position.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < radius) {
            const normalX = dx / (fallOff ? dist : 1);
            const normalY = dy / (fallOff ? dist : 1);
            const force = { x: normalX * forceMagnitude, y: normalY * forceMagnitude };
            Matter.Body.applyForce(body, body.position, force);
        }
    });
}
function createBustForce(forceMagnitude = 0.6) {
    shakeScreen();
    whiteCloud.src = "ui/cloud-bust.png";
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        Matter.Body.applyForce(body, body.position, { x:0, y:forceMagnitude*(0.7+Math.random()*0.6) });
    });
}
function shakeScreen(duration = 500, intensity = 10) {
    const container = document.getElementById("mainContainer"); // Or the canvas parent
    const start = performance.now();
    function animate(time) {
        const elapsed = time - start;
        const effIntensity = intensity * (1 - elapsed/duration);
        if (elapsed < duration) {
            // random offset each frame
            const x = (Math.random() * 2 - 1) * effIntensity;
            const y = (Math.random() * 2 - 1) * effIntensity;
            container.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(animate);
        } else {
            // Reset transform
            container.style.transform = "";
        }
    }
    requestAnimationFrame(animate);
}
//////////////////// ^^^^^^^^^^^^^

// Button to end round, buy chips, and restart round ===========================
endBtn.addEventListener('click', () => // Initial confirmation to end round
    showConfirmSplash({
        title: "End Round?",
        message: "Are you sure you want to end the round? This can't be undone.",
        cancelText: "Cancel",
        confirmText: "Yes, End Round",
        onConfirm: () => placeRedChips(),
        holdToConfirm: false
    })
);
// Do witch card peek at end of round
// Do greens that need exactly 7 white
// Place any red chips (variant B) that were saved
function placeRedChips() {
    if (game.chipVariants.red != 'B' || chipsRedAside.length == 0) {
        enterSummaryPhase()
    } else {
        writeToLog(`Placing saved red chips`, chipColors.red);
    showSelectorSplash({
        title: "Placing Saved Red Chips",
        message: "You may place all these chips",
        confirmText: "Place",
        holdToConfirm: false,
        chipsToSelect: [chipsRedAside],
        maxSelect: 99,
        showGold: false,
        showTrack: true,
        onConfirm: (selectedChips) => {
            selectedChips.forEach(c => placeChip(c)) // Place selected chips
            chipsRedAside = chipsRedAside.filter(c => !selectedChips.includes(c));
            saveGameState();  enterSummaryPhase();
        }
    });
    }
}
// Do end of round summary
function enterSummaryPhase() {
    const overlay = quickElement("div","splash-overlay");
    const box = quickElement("div","splash-box");
    const titleElem = quickElement("h2","splash-title","End of Round");
    box.appendChild(titleElem);
    
    const msgElem = quickElement("p","splash-message","You get xxxxxxxx!")
    box.appendChild(msgElem);

    let endOptions = {
        green: trackActual.placed.filter((c,i) => c.color == 'green' && i > trackActual.placed.length-3 && game.chipVariants.green != 'C').length,
        purple: Math.min(3, trackActual.placed.filter((c) => c.color == 'purple' && game.chipVariants.purple != 'C').length),
        black: trackActual.placed.filter((c) => c.color == 'black').length
    }

    function disableButton(button, row) {
        row.removeChild(button);
        row.appendChild(createButton({ buttonText:"Already done", buttonColor:"grey" }));
    }

            // A:{ 1:4, 2:8, 4:14 },  // ruby
            // B:{ 1:6, 2:11, 4:18 }, // free chip
            // C:{ 1:6, 2:11, 4:21 }, // seven white
            // D:{ 1:4, 2:8, 4:14 },  // ruby swap
    const greenRow = quickElement("div","splash-buttons-row");
    const greenElem = quickChipElement({ color:'green' }, endOptions.green);
    greenRow.appendChild(greenElem);
    if (endOptions.green) {
        const buttonText = { A:"Receive Bonus!", B:"Receive Bonus!", D:'Pay 1 <img src="ui/ruby.png" class="textRuby"> ruby to move droplet?' };
        const greenBtn = createButton({
            buttonText: buttonText[game.chipVariants.green],
            onClick: () => {
                if (game.chipVariants.green == "A") {
                    showConfirmSplash({
                        message: "You get rubies",
                        confirmText: "",
                        cancelText: "Ok"
                    });
                    endOptions.green = 0;  disableButton(greenBtn,greenRow);
                } else if (game.chipVariants.green == "B") {
                    showConfirmSplash({
                        message: "You get free chip",
                        confirmText: "",
                        cancelText: "Ok"
                    });
                    endOptions.green = 0;  disableButton(greenBtn,greenRow);
                } else if (game.chipVariants.green == "D") {
                    showConfirmSplash({
                        message: "Your droplet has been moved.",
                        cancelText: "Go back",
                        confirmText: "Pay 1 ruby",
                        holdToConfirm: true,
                        onConfirm: () => {
                            endOptions.green -= 1;
                            game.dropletStats.value += 1;
                            if (endOptions.green == 1) greenBtn.firstChild.textContent = "Pay another ruby to move droplet again?";
                            if (endOptions.green == 0) disableButton(greenBtn,greenRow)
                        }
                    });
                }
            },
            holdToClick: true
        });
        greenRow.appendChild(greenBtn);
    } else { // Show a dead button
        if (game.chipVariants.green == 'C') {
            setElementToChip(greenElem,{ color:'green' },trackActual.placed.filter((c,i) => c.color == 'green').length);
            greenRow.appendChild(createButton({ buttonColor:"grey",
                buttonText: (totalWhite==7) ? "Green chips doubled!" : "Need exactly 7 white" }));
        } else {
            greenRow.appendChild(createButton({ buttonText:"No green chips", buttonColor:"grey" }));
        }
    }
    box.appendChild(greenRow);
    
    const purpleRow = quickElement("div","splash-buttons-row");
    const purpleElem = quickChipElement({ color:'purple' }, endOptions.purple);
    purpleRow.appendChild(purpleElem);
    if (endOptions.purple) {
        const buttonText = { A:"Receive Bonus!", B:`Trade in ${endOptions.purple} purple chips?`, D:"Upgrade a Chip!" };
        const purpleBtn = createButton({
            buttonText: buttonText[game.chipVariants.purple],
            onClick: () => {
                if (game.chipVariants.purple == "A") {
                    if (endOptions.purple == 3) game.dropletStats.value += 1;
                    endOptions.purple = 0;  disableButton(purpleBtn, purpleRow);
                    showConfirmSplash({
                        message: ( endOptions.purple == 1 ? "You get 1 victory point!" : 
                                 ( endOptions.purple == 2 ? "You get 1 victory point and a ruby!" : 
                                    "You get 2 victory points!<br><br>Your droplet has been upgraded!" )),
                        confirmText: "",
                        cancelText: "Ok"
                    });
                } else if (game.chipVariants.purple == "B") {
                    showConfirmSplash({
                        message: ( endOptions.purple == 1 ? "Exchange 1 purple chip for 1 victory point, a ruby, and a black 1-chip?" : 
                                 ( endOptions.purple == 2 ? "Exchange 2 purple chips for 3 victory points, a droplet upgrade, a green 1-chip, and a blue 2-chip?" : 
                                    "Exchange 3 purple chips for 6 victory points, a ruby, 2 droplet upgrades, and a yellow 4-chip?" )),
                        cancelText: "Go Back",
                        confirmText: "Exchange",
                        holdToConfirm: true,
                        onConfirm: () => {
                            // Remove purple chips and grant the reward
                            if (endOptions.purple == 1) chipsOwned.push({color:"black", value:1});
                            if (endOptions.purple == 2) { game.dropletStats.value += 1; chipsOwned.push({color:"green", value:1}); chipsOwned.push({color:"blue", value:2}); }
                            if (endOptions.purple == 3) { game.dropletStats.value += 2; chipsOwned.push({color:"yellow", value:4}); }
                            showConfirmSplash({
                                message: ( endOptions.purple == 1 ? "You get 1 victory point and a ruby!<br><br>A black 1-chip is added to your bag." : 
                                    ( endOptions.purple == 2 ? "You get 3 victory points!<br><br>Your droplet has been upgraded!<br>A green 1-chip and a blue 2-chip are added to your bag." : 
                                        "You get 6 victory points and a ruby!<br><br>Your droplet has been upgraded twice!<br>A yellow 4-chip is added to your bag." )),
                                        cancelText: "Ok",
                                        confirmText: ""
                                    });
                            while (endOptions.purple) { endOptions.purple -= 1;  chipsOwned.splice(chipsOwned.findIndex(c => c.color === 'purple'), 1); }
                            disableButton(purpleBtn, purpleRow);
                        }
                    });
                } else if (game.chipVariants.purple == "D") {
                    showSelectorSplash({
                        title: "Upgrade Chip",
                        message: `You may upgrade a chip from ${endOptions.purple==2?2:1} to ${endOptions.purple==1?2:4}`,
                        confirmText: "Upgrade",
                        holdToConfirm: false,
                        chipsToSelect: [chipsOwned.filter(c => ['red','blue','yellow','green'].includes(c.color) && c.value<(endOptions.purple==1?2:4))],
                        maxSelect: 1,
                        showGold: false,
                        onConfirm: (selectedChips) => { if (selectedChips.length) {
                            const chip = selectedChips[0];  const prevText = `${chip.color} ${chip.value}-chip`;
                            chip.value = ( endOptions.purple==1 || (endOptions.purple==2 && chip.value==1) ? 2 : 4 );
                            writeToLog(`Upgraded ${prevText} to ${chip.value}-chip`, 'purple');
                            endOptions.purple = 0;  disableButton(purpleBtn, purpleRow);
                        } }
                    });
                }
            },
        });
        purpleRow.appendChild(purpleBtn);
    } else { // Show a dead button
        purpleRow.appendChild(createButton({ buttonText:"No purple chips", buttonColor:"grey" }));
    }
    box.appendChild(purpleRow);
    
    const blackRow = quickElement("div","splash-buttons-row");
    const blackElem = quickChipElement({ color:'black' }, endOptions.black);
    blackRow.appendChild(blackElem);
    if (endOptions.black) {
        const blackBtn = createButton({
            buttonText: "More than one player next to you?",
            onClick: () => {
                game.dropletStats.value += 1;
                showConfirmSplash({
                    message: "Your droplet has been moved.<br><br>If you have more black chips than both players next to you, take a ruby as well.",
                    confirmText: "",
                    cancelText: "Ok"
                });
                disableButton(blackBtn, blackRow);
            },
            holdToClick: true
        });
        blackRow.appendChild(blackBtn);

    } else { // Show a dead button
        blackRow.appendChild(createButton({ buttonText:"No black chips", buttonColor:"grey" }));
    }
    box.appendChild(blackRow);

    const shopRow = quickElement("div","splash-buttons-row");
    const shopBtn = createButton({
        buttonText: "Go to buy chips",
        onClick: () => {
            document.body.removeChild(overlay);
            enterBuyPhase();
        },
        holdToClick: true
    });
    shopRow.appendChild(shopBtn);
    box.appendChild(shopRow);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
}
function enterBuyPhase(gold = spaceValues[trackActual.currIndex+1][0]) { // Enter the buy phase to buy 2 new chips
    writeToLog(`Ended round`);
    game.prevBuy.gold = gold;  game.prevBuy.chips = [];
    showSelectorSplash({
        title: "End of Round",
        message: `Spend up to <span class="textGold">${gold}</span> gold on 2 chips`,
        cancelText: "",
        confirmText: "Purchase",
        holdToConfirm: true,
        chipsToSelect: chipBuyOrder.slice(0,-1),
        gold: gold,
        showDesc: true,
        onConfirm: (selectedChips) => {
            selectedChips.forEach(thisChip => {
                chipsOwned.push({ color:thisChip.color, value:thisChip.value }); // Must be new object
                game.prevBuy.chips.push({ color:thisChip.color, value:thisChip.value });
                writeToLog(`Bought ${thisChip.color} ${thisChip.value}-chip`, 'green');
            });
            restartRound();
        }
    });
}
function restartRound(round = game.roundCount) {
    // Start the round with owned chips, except reds which were saved for the next round
    // Restarting this round makes the red chips stay removed...
    chipsInBag = [...chipsOwned].filter(c => !chipsRedAside.includes(c));
    game.roundCount = round;
    initializeTrack();
    updateWhiteCount();
    saveGameState();
    initializePhysics();
}
function initializePhysics() {
    Matter.Composite.clear(world, false);
    const wallProperties = { isStatic: true, render: { visible: false } };
    const walls = [ // rectangle(x_center, y_center, width, height, options)
        Matter.Bodies.rectangle(canvas.width / 2, canvas.height + 20, canvas.width, 40, wallProperties), // floor
        Matter.Bodies.rectangle(canvas.width / 2, -canvas.height - 20, canvas.width, 40, wallProperties), // roof
        Matter.Bodies.rectangle(canvas.width / 2, -20, canvas.width, 40, { isStatic: true, render: { visible: false }, label: "oneWay" }), // half-roof
        Matter.Bodies.rectangle(-20, 0, 40, canvas.height*2, wallProperties), // left
        Matter.Bodies.rectangle(canvas.width + 20, 0, 40, canvas.height*2, wallProperties) // right
    ];
    Matter.Composite.add(world, walls);
    gyro.lockout = true; 
    setTimeout(() => gyro.lockout = false, 2500 );
    addPhysicsChips(chipsInBag);
    Matter.Events.on(engine, "afterUpdate", () => {
        for (const wall of walls) {
            wall.position.x = Math.round(wall.position.x);
            wall.position.y = Math.round(wall.position.y);
            wall.velocity.x = 0;
            wall.velocity.y = 0;
            wall.angularVelocity = 0;
            wall.angle = 0;
        }
    });
}
function restartGame() { // Reset the entire game
    game.seed = null,    // Seed (unused)
    game.actionLog = [], // Text log of actions
    game.roundCount = 1, // Which round it is
    game.prevBuy = { gold: 0, chips: [] }, // Amount of gold and chips purchased in previous shop phase
    game.dropletStats = { color:'droplet', value:1 }, // Stats of the droplet, can be upgraded
    game.ratStats = { color:'rat', value:2 },         // Stats of rat tails, set at the start of each round
    game.isPotionFull = true, // If the potion is available
    chipsOwned = [...starterChips]; // Chips in bag at start of game, added to in shop phase
    chipsInBag = [...starterChips]; // Chips in bag at start of each round, chips removed as they are drawn
    totalWhite = 0;    // Current total of white chips placed
    totalWhiteMax = 7; // Maximum total of white chips without busting (usually 7)
    chipsRedAside = []; // List of Red B chips, to be placed at end of round, or saved until next round
    restartRound();
}

rulesBtn.addEventListener('click', () => showSelectorSplash({ // Show the rules screen
    title: "View Rules",
    message: "",
    cancelText: "",
    confirmText: "Return to Game",
    chipsToSelect: chipRulesOrder,
    gold: 999,
    maxSelect: 1,
    showDesc: true,
    onConfirm: () => {}
}));
// witchBtn.addEventListener('click', showWitchMenu);
function showVariantMenu() {

}

// Button to open witch menu and activate witch effects ===========================
witchBtn.addEventListener('click', showWitchMenu);
function showWitchMenu() {
    const overlay = quickElement("div","splash-overlay");
    const box = quickElement("div","splash-box");
    const titleElem = quickElement("h2","splash-title","Witch Menu");
    box.appendChild(titleElem);
    const msgElem = quickElement("p","splash-message","Choose an effect");
    box.appendChild(msgElem);
    const witchContainer = quickElement("div","witch-container");

    const redoButton = createButton({
        buttonText: "Re-do buy phase",
        buttonColor: chipColors.blue,
        onClick: () => {
            writeToLog(`Used witch effect to re-do last shop phase`, 'pink');
            game.prevBuy.chips.forEach(chip => chipsOwned.splice(chipsOwned.findIndex(c => c.color === chip.color && c.value === chip.value), 1));
            document.body.removeChild(overlay);
            enterBuyPhase(game.prevBuy.gold);
        }
    });
    witchContainer.appendChild(redoButton);

    const freeButton = createButton({
        buttonText: "Add chip to bag",
        buttonColor: chipColors.blue,
        onClick: () => showSelectorSplash({
            title: "Add chip to bag for free",
            message: "",
            confirmText: "Purchase",
            holdToConfirm: true,
            chipsToSelect: chipBuyOrder,
            maxSelect: 1,
            showDesc: true,
            onConfirm: (selectedChips) => {
                selectedChips.forEach(thisChip => {
                    const newChip = { color:thisChip.color, value:thisChip.value };
                    chipsOwned.push(newChip);
                    chipsInBag.push(newChip);
                    addPhysicsChips([newChip]);
                    writeToLog(`Used witch effect to steal ${thisChip.color} ${thisChip.value}-chip`, 'pink');
                });
                document.body.removeChild(overlay);
            }
        })
    });
    witchContainer.appendChild(freeButton);

    witchContainer.appendChild(quickElement("div","splash-message","Peek at chips in bag:"))
    const peekRow = quickElement("div","splash-buttons-row");
    peekRow.style.marginTop = "-10px";
    [1,2,3,4,5].forEach(value => {
        const peekButton = createButton({
            buttonText: value,
            buttonColor: chipColors.blue,
            onClick: () => { showSelectorSplash({
                    title: "Peek at Chips",
                    message: "You may place 1 chip in your pot",
                    confirmText: "Place",
                    holdToConfirm: false,
                    chipsToSelect: [grabChipFromBag(value)],
                    maxSelect: 1,
                    showGold: false,
                    showTrack: true,
                    onConfirm: (selectedChips) => {
                        if (selectedChips.length) writeToLog(`Used witch effect to peek at chips`, 'pink');
                        placeChip(removeChipFromBag(selectedChips[0])) // Place selected chip
                    }
                });
                document.body.removeChild(overlay);
            }
        });
        peekRow.appendChild(peekButton);
    });
    witchContainer.appendChild(peekRow);

    const restartRoundButton = createButton({
        buttonText: "Restart Round",
        buttonColor: chipColors.blue,
        onClick: () => showConfirmSplash({
            title: "Restart Round?",
            message: "You aren't normally supposed to do this, except for a witch card.",
            cancelText: "Cancel",
            confirmText: "Restart Round",
            holdToConfirm: true,
            onConfirm: () => { restartRound(); document.body.removeChild(overlay); }
        })
    });
    witchContainer.appendChild(restartRoundButton);

    const restartGameButton = createButton({
        buttonText: "Restart Game",
        buttonColor: chipColors.blue,
        onClick: () => showConfirmSplash({
            title: "Restart Entire Game?",
            message: "Delete everything from this game, and start a new game?",
            cancelText: "Cancel",
            confirmText: "Start New Game",
            holdToConfirm: true,
            onConfirm: () => { restartGame(); document.body.removeChild(overlay); }
        })
    });
    witchContainer.appendChild(restartGameButton);

    const clearSaveButton = createButton({
        buttonText: "Clear Save",
        buttonColor: chipColors.blue,
        onClick: () => showConfirmSplash({
            title: "Delete Saved Data?",
            message: "This will wipe your current game progress, and fix corrupted save data.",
            cancelText: "Cancel",
            confirmText: "Delete Data",
            holdToConfirm: true,
            onConfirm: () => { localStorage.clear(); restartGame(); document.body.removeChild(overlay); }
        })
    });
    witchContainer.appendChild(clearSaveButton);

    const btnRow = quickElement("div","splash-buttons-row");
    const cancelBtn = createButton({
        buttonText: "Return to game",
        buttonColor: chipColors.blue,
        onClick: () => document.body.removeChild(overlay)
    });
    btnRow.appendChild(cancelBtn);

    box.appendChild(witchContainer);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

// Button to expand board and open rat menu ===========================
trackActual.addEventListener('click', clickOnTrack);
function clickOnTrack() {
    if (trackActual.placed.length && !['rat','droplet'].includes(trackActual.placed[trackActual.placed.length-1].color)) {
        expandBoard(); // If actual chips have been drawn, expand the board
    } else { 
        openRatMenu(); // If no chips drawn, show the rat menu
    }
}
function expandBoard() {

}
function openRatMenu() {
    const overlay = quickElement("div","splash-overlay");
    const box = quickElement("div","splash-box");
    const titleElem = quickElement("h2","splash-title","Rat Tails");
    box.appendChild(titleElem);
    const msgElem = quickElement("p","splash-message","Set the number of rat tails for this round");
    box.appendChild(msgElem);

    const ratRow = quickElement("div","splash-buttons-row");
    const chipElem = quickChipElement({ color:'rat' });
    let amount = game.ratStats.value;  setElementToChip(chipElem, { color:'rat' }, amount);
    const minusBtn = createButton({
        buttonText: "-",
        buttonColor: chipColors.red,
        onClick: () => {
            amount = Math.max(0, amount-1);
            setElementToChip(chipElem, { color:'rat' }, amount);
        }
    });
    const plusBtn = createButton({
        buttonText: "+",
        buttonColor: chipColors.green,
        onClick: () => {
            amount = amount+1;
            setElementToChip(chipElem, { color:'rat' }, amount);
        }
    });
    ratRow.appendChild(minusBtn);  ratRow.appendChild(chipElem);  ratRow.appendChild(plusBtn);
    msgElem.appendChild(ratRow);

    const btnRow = quickElement("div","splash-buttons-row");
    const cancelBtn = createButton({
        buttonText: "Cancel",
        buttonColor: chipColors.blue,
        onClick: () => document.body.removeChild(overlay)
    });
    const confirmBtn = createButton({
        buttonText: `Set Rat Tails`,
        buttonColor: chipColors.orange,
        onClick: () => {
            document.body.removeChild(overlay);
            game.ratStats.value = amount;
            initializeTrack(); // Replace track with new rat tails
        }
    });

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

drawBtn.addEventListener('click', () => regularPull());
potionBtn.addEventListener('click', usePotion);
logBtn.addEventListener('click', () => 
    showConfirmSplash({ // Show the log
        title: "Action Log:",
        message: [...game.actionLog,['','End of log']].map(a => `<div class="log-row"><div>${a[0]}</div><div style="color:${a[2]};">${a[1]}</div></div>`).join(''),
        cancelText: "Return to game",
        confirmText: "",
        holdToConfirm: false
    })
);
document.addEventListener('keydown', (event) => {
    if (event.key == " ") {
        regularPull();
        event.preventDefault();
    }
    if (event.key == "Enter") {
        event.preventDefault();
    }
    if (event.key == "r") {
        restartRound();
    }
    if (event.key == "g") {
        restartGame();
    }
    if (event.key == "l") {
        loadGameState();
    }
});

loadGameState();