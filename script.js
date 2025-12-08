// All game logic is in this script

let game = { // All variables for the game state
    lobby: {
        variant: {}, // Which variants are selected for each color
        seed: null,  // Seed encoding of chip variants, for joining a lobby
        actionLog: [], // Text log of actions
    },
    round: {
        count: 1, // Which round it is
        prevBuy: { gold: 0, chips: [] }, // Amount of gold and chips purchased in previous shop phase
    },
    player: {
        droplet: { color:'droplet', value:1 }, // Stats of the droplet, can be upgraded
        rat: { color:'rat', value:2 },         // Stats of rat tails, set at the start of each round
        isPotionFull: true, // If the potion is available
    },
    chips: {
        owned: [...starterChips], // Chips in bag at start of game, added to in shop phase
        inBag: [...starterChips], // Chips in bag at start of each round, chips removed as they are drawn
        totalWhite: 0,    // Current total of white chips placed
        totalWhiteMax: 7, // Maximum total of white chips without busting (usually 7)
        redSaved: [], // List of Red B chips, to be placed at end of round, or saved until next round
        cost: {}, // Chip costs of the selected variants: [color][value]
        desc: {}, // Chip descriptions of the selected variants: [color][value]
    },
    track: document.getElementById('trackActual'),
        // track.elements, track.currIndex, track.currElem
};
game.lobby.variant = { green:'C', red:'B', blue:'A', yellow:'C', orange:'A', black:'A', purple:'B', white:'A' };
for (const color in game.lobby.variant) { // List the chip costs of only the selected variants
    const variant = game.lobby.variant[color];
    game.chips.cost[color] = allVariants.cost[color][variant];
    game.chips.desc[color] = allVariants.desc[color][variant];
}

function initializeBoard(track = game.track) {
    track.innerHTML = '';
    track.elements = spaceValues.map((val,i) => { // Elements for board spaces
        const newSpace = document.createElement('div');
        newSpace.gold = val[0];  newSpace.VP = val[1];  newSpace.ruby = val[2];
        resetTrackSpace(newSpace);  track.appendChild(newSpace);
        return newSpace;
    });
    track.currIndex = 0; // Index of the furthest space a chip is placed
    track.currElem = track.elements[0]; // Element of furthest chip space
    track.placed = []; // List of chips currently placed on the track
    placeChip(game.player.droplet, track);
    if (game.player.rat.value) {
        placeChip(game.player.rat, track);
    }
}

function regularPull() {
    if (document.querySelector(".confirm-overlay")) return; // Can't pull if there is an overlay
    const grabbedChip = grabChipFromBag()
    const chip = removeChipFromBag(grabbedChip);
    placeChip(chip);
}
function grabChipFromBag(multiDraw = 0) {
    if (game.chips.inBag.length === 0 || game.chips.totalWhite > game.chips.totalWhiteMax || game.track.currIndex == game.track.elements.length-2) return;
    if (multiDraw) {
        const arr = [...game.chips.inBag.keys()]; // [0,1,2,...]
        arr.forEach((_, i) => { const j = Math.floor(Math.random() * (i + 1));  [arr[i], arr[j]] = [arr[j], arr[i]] });
        return arr.slice(0, multiDraw).map(i => game.chips.inBag[i]); // Return array of chips
    } else { // Return one index
        const index = Math.floor(Math.random() * game.chips.inBag.length);
        return game.chips.inBag[index];
    }
}
function removeChipFromBag(chip) {
    if (chip == undefined) return;
    game.chips.inBag = game.chips.inBag.filter(c => c != chip); // Remove chip from current bag
    if (chip.body) {
        if (chip.color == 'white' && chip.value+game.chips.totalWhite > game.chips.totalWhiteMax) {
            animateChipExplosion(chip.body);
        } else {
            Matter.Composite.remove(world, chip.body); // Remove physics chip from world
            createShockwave(chip.body, 150, 0.03);
        }
    }
    if (chip.color == 'red' && game.lobby.variant.red == 'B') { redSaveForLater(chip); return; }
    writeToLog(`Placed ${chip.color} ${chip.value}-chip`);
    return chip;
}
function placeChip(chip, track = game.track) {
    if (chip == undefined) return;
    const isReal = (track == game.track);
    let spaces = chip.value;  const prevChip = track.placed[track.placed.length-1];
    // Do chip effects that increase the number of spaces
    if (chip.color == 'yellow' && game.lobby.variant.yellow == 'A' && prevChip?.color == 'white' && isReal) yellowReturnWhite();
    if (game.lobby.variant.yellow == 'C' && prevChip?.color == 'yellow') spaces *= 2;
    if (chip.color == 'red' && game.lobby.variant.red == 'A' && track.placed.filter(c => c.color=='orange').length > 0) spaces += 1;
    if (chip.color == 'red' && game.lobby.variant.red == 'A' && track.placed.filter(c => c.color=='orange').length > 2) spaces += 1;
    if (chip.color == 'red' && game.lobby.variant.red == 'C' && prevChip?.color == 'white') spaces += prevChip?.value;
    if (chip.color == 'white' && game.lobby.variant.red == 'D' && chip.value == 1 && track.placed.filter(c => c.color == 'red').length) spaces += 1;
    // Render the chip onto the track space
    track.placed.push(chip);
    track.currIndex = Math.min(track.elements.length-2, track.currIndex+spaces);
    track.currElem = track.elements[track.currIndex];
    track.currElem.scrollIntoView({behavior: "smooth", inline: "center"});
    track.currElem.className = 'chip';
    track.currElem.style.background = chipColors[chip.color];
    const rubyElem = track.currElem.ruby ? '<img src="ui/ruby.png" class="trackRuby"</img>' : '';
    track.currElem.innerHTML = `${rubyElem}${chip.value}`;
    if (isReal) updateWhiteCount();
    // Do chips effects that resolve after the chip is placed
    if (chip.color == 'blue' && game.lobby.variant.blue == 'C' && track.currElem.ruby && isReal) awardVPR(0,1,chip);
    if (chip.color == 'blue' && game.lobby.variant.blue == 'D' && track.currElem.ruby && isReal) awardVPR(chip.value,0,chip);
    if (chip.color == 'purple' && game.lobby.variant.purple == 'C' && track.currElem.gold >= 10 && isReal) awardVPR(Math.floor(track.currElem.gold/10),0,chip);
    if (chip.color == 'blue' && game.lobby.variant.blue == 'A' && isReal) bluePeeking(chip.value);
}
function bluePeeking(value) { // Peek at multiple chips, and you may place one
    writeToLog(`Blue effect peeked at ${value} chips`, chipColors.blue);
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
function yellowReturnWhite() {
    resetTrackSpace(game.track.currElem);
    const [chip] = game.track.placed.splice(game.track.placed.length-2,1);
    writeToLog(`Yellow effect returned ${chip.color} ${chip.value}-chip`, chipColors.yellow);
    chip.body = spawnChip(chip.color, chip.value)
    game.chips.inBag.push(chip);
}
function redSaveForLater(chip) {
    game.chips.redSaved.push(chip);
    const newChip = quickElement('div','chip',chip.value)
    newChip.style.background = chipColors[chip.color];
    newChip.style.margin = '5px auto';
    showConfirmSplash({
        title: `Red Chip Saved For Later`,
        message: newChip.outerHTML,
        cancelText: "",
        confirmText: "Ok",
    });
}
function awardVPR(VP = 0, ruby = 0, chip = null) {
    const newChip = quickElement('div','chip',chip.value)
    if (chip.color == 'blue') newChip.innerHTML = `<img src="ui/ruby.png" class="trackRuby"</img>${chip.value}`;
    newChip.style.background = chipColors[chip.color];
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
    if (game.track.placed.length && game.player.isPotionFull && game.chips.totalWhite <= game.chips.totalWhiteMax) {
        // Put chip back into bag, and reset the track space
        const chip = removeLastChip(game.track);
        chip.body = spawnChip(chip.color, chip.value)
        game.chips.inBag.push(chip);
        writeToLog(`Used potion on ${chip.color} ${chip.value}-chip`);
        updateWhiteCount();
        // game.player.isPotionFull = false;
    }
}
function removeLastChip(track = game.track) {
    resetTrackSpace(track.currElem);
    track.currIndex = track.elements.map(e => e.className).lastIndexOf("chip");
    track.currElem = track.elements[track.currIndex];
    track.currElem.scrollIntoView({behavior: "smooth", inline: "center"});
    return track.placed.pop();
}
function resetTrackSpace(space = game.track.currElem) {
    space.className = 'trackSpace';
    const rubyElem = space.ruby ? '<img src="ui/ruby.png" class="trackRuby"</img>' : '';
    space.innerHTML = `${rubyElem}<div class="trackGold">${space.gold}</div><div class="trackVP">${space.VP}</div>`;
    space.style.background = '';
}
function updateWhiteCount() {
    game.chips.totalWhite = game.track.placed.filter(c => c.color === 'white').reduce((sum, c) => sum + c.value, 0);
    whiteCounter.innerHTML = `${game.chips.totalWhite}/${game.chips.totalWhiteMax}`;
    if (game.chips.totalWhite > game.chips.totalWhiteMax) {
        writeToLog(`Pot exploded with ${game.chips.totalWhite} white chips!`,chipColors.red)
        createBustForce();
        whiteOdds.innerHTML = 'BUST!';
        drawBtn.innerHTML = 'BUST!';
    } else {
        const odds = Math.ceil(game.chips.inBag.filter(c => c.color === 'white').reduce((canBust, c) => canBust + ((c.value + game.chips.totalWhite) > game.chips.totalWhiteMax), 0)/game.chips.inBag.length*100);
        whiteOdds.innerHTML = `${odds}%`;
        drawBtn.innerHTML = 'Draw Chip';
    };
}

function writeToLog(actionString, color = "white") {
    const now = new Date();
    let timeString = now.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    timeString = timeString.replace(/\s?[AP]M/i, ''); // remove AM/PM
    game.lobby.actionLog.push([timeString,actionString,color]);
}
function showConfirmSplash({
    title = "",
    message = "",
    cancelText = "Cancel",
    confirmText = "",
    onConfirm = () => {},
    holdToConfirm = false,
}) {
    const overlay = quickElement("div","confirm-overlay");
    const box = quickElement("div","confirm-box");
    const titleElem = quickElement("h2","confirm-title",title);
    const msgElem = quickElement("p","confirm-message",message)
    const btnRow = quickElement("div","confirm-buttons");
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
}) {
    let selectedChips = [];
    const overlay = quickElement("div","confirm-overlay");
    const box = quickElement("div","confirm-box");
    const titleElem = quickElement("h2","confirm-title",title);
    const msgElem = quickElement("p","confirm-message",message)
    const btnRow = quickElement("div","confirm-buttons");
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
    };

    const track = quickElement('div','track');
    track.style.margin = "0px -20px 18px";
    initializeBoard(track);
    game.track.placed.forEach(c => {
        if (!['rat','droplet'].includes(c.color)) placeChip(c, track);
    });
    ptrack = track;

    if (showTrack) box.appendChild(track);
    if (title) box.appendChild(titleElem);
    if (message) box.appendChild(msgElem);
    
    const chipList = quickElement("div","chip-selector");
    chipsToSelect.forEach(thisBuyRow => {
        const chipRow = quickElement("div","chip-selector-row");

        thisBuyRow.forEach(chip => {
            const itemDiv = quickElement("div","chip-selector-item");
            const chipIcon = quickElement("div","chip",chip.value);
            chipIcon.style.background = chipColors[chip.color];
            itemDiv.appendChild(chipIcon);
            
            const cost = game.chips.cost[chip.color][chip.value];
            const goldIcon = quickElement("div","trackGold",cost);
            if (showGold) itemDiv.appendChild(goldIcon)

            chipRow.appendChild(itemDiv);
            itemDiv.addEventListener("click", () => {
                if (selectedChips.includes(chip)) { // Unselect
                    selectedChips.forEach(c => removeLastChip(track));
                    selectedChips = selectedChips.filter(x => x !== chip);
                    selectedChips.forEach(c => placeChip(c, track));
                    itemDiv.classList.remove("selected");
                } else { // Select if possible
                    if (maxSelect == 1) { // Swap single selection
                        if (cost > gold) {
                            flashRed(itemDiv);
                        } else {
                            chipList.querySelectorAll('.chip-selector-item').forEach(e => e.classList.remove('selected'));
                            if (selectedChips.length) removeLastChip(track);
                            selectedChips = [chip];
                            itemDiv.classList.add("selected");
                            placeChip(chip, track);
                        }
                    } else if ( (selectedChips.length >= maxSelect) // Limit amount
                        || (cost + selectedChips.reduce((sum, c) => sum + game.chips.cost[c.color][c.value], 0) > gold) // Need enough gold
                        || (selectedChips.some(c => c.color == chip.color) && maxSelect == 2) ) { // Can't buy same color
                            flashRed(itemDiv);
                    } else { // Add chip to selected
                        selectedChips.push(chip);
                        itemDiv.classList.add("selected");
                        placeChip(chip, track);
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
    const text = ['zero','this','two','three','four','five','six','seven','eight','nine','ten'];
    if (num >= text.length) return `${num} chips`;
    return `${text[num]} chip${num==1?'':'s'}`;
}
function createButton({
    buttonText = "OK",
    buttonColor = chipColors.orange,
    onClick = () => {},
    holdToClick = false
}) {
    const newButton = quickElement("button","confirm-btn",buttonText);
    newButton.style.backgroundColor = buttonColor;
    if (!holdToClick) {
        newButton.onclick = onClick; // Simple click
    } else {
        const bar = quickElement("div","confirm-hold-bar");
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
        newButton.addEventListener("contextmenu", e => e.preventDefault());
        newButton.addEventListener("touchstart", e => { e.preventDefault(); startHold(); }, { passive: false });
        newButton.addEventListener("touchend", cancelHold);
        newButton.addEventListener("mousedown", e => { e.preventDefault(); startHold(); });
        newButton.addEventListener("mouseup", cancelHold);
        newButton.addEventListener("mouseleave", cancelHold);
    }
    return newButton;
}
function quickElement(type, className, innerHTML = '') {
    const newElement = document.createElement(type);
    newElement.className = className;
    newElement.innerHTML = innerHTML;
    return newElement;
}
function flashRed(element) {
    element.classList.remove("flash-red"); // reset if already applied
    void element.offsetWidth;              // force reflow so animation restarts
    element.classList.add("flash-red");
}

//////////////////// vvvvvvvvvvvvv
// === Setup Matter.js ===

const canvas = document.getElementById("chipsCanvas");

// Make sure parent has been laid out
function resizeCanvasToParent() {
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
resizeCanvasToParent(); // Initial resize (after DOM is ready)
window.addEventListener("resize", resizeCanvasToParent); // Update on window resize

// --- Matter.js setup ---
const engine = Matter.Engine.create();
const world = engine.world;
engine.world.gravity.y = 1.5;
const render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        wireframes: false,
        background: "rgba(0,0,0,0)",//"#25212955",  // ????????????????????????????????
        width: canvas.width,
        height: canvas.height,
        antiAlias: true
    }
});
render.options.hasBounds = false;
render.options.wireframes = false;
render.options.background = null;
render.options.showDebug = false;
render.options.showBroadphase = false;
render.options.showBounds = false;
render.options.showVelocity = false;

let gyro = { enabled: true, lockout: false, factor: 0.25, shakeFactor: 0.5, spinFactor: 0.00005 };
window.addEventListener("devicemotion", e => {
    if (gyro.enabled && !gyro.lockout) {
        let grav = e.accelerationIncludingGravity;
        const accel = e.acceleration;
        engine.world.gravity.x = -grav.x*gyro.factor - accel.x*gyro.shakeFactor;
        engine.world.gravity.y = grav.y*gyro.factor + accel.y*gyro.shakeFactor;

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

const runner = Matter.Runner.create();
Matter.Render.run(render);
Matter.Runner.run(runner, engine);

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
            if (game.chips.inBag.includes(chip)) chip.body = spawnChip(chip.color, chip.value); 
        }, cumulative );
        delay *= accel;
        cumulative += delay;
    });
}
// --- Chip spawning ---
function spawnChip(color, value) {
    const radius = 64;
    const chipBody = Matter.Bodies.circle(
        Math.random() * (canvas.width - radius*2) + radius,
        -100 - Math.random() * 300,
        radius,
        {
            restitution: 0.95,
            friction: 0.1,
            frictionAir: 0.01,
            render: {
                sprite: {
                    texture: `chips/green${value}.png`,
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
function createBustForce(forceMagnitude = 0.3) {
    // shakeScreen();
    const bodies = Matter.Composite.allBodies(world);
    // bodies.forEach(body => {
    //     Matter.Body.applyForce(body, body.position, { x:0, y:forceMagnitude*(0.7+Math.random()*0.6) });
    // });
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
/**
 * Makes a Matter.js chip grow and then explode.
 * @param {Matter.Body} chipBody - The physics body of the chip.
 * @param {number} growDuration - How long to scale up in ms.
 * @param {number} explosionForce - Max force to apply on explosion.
 */
function animateChipExplosion(chipBody, growDuration = 1000, explosionForce = 0.05) {
    const startTime = performance.now();
    const startScale = chipBody.render.sprite.xScale; // current sprite scale
    const endScale = startScale * 2;
    function animate(time) {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / growDuration, 1);

        // Smooth scaling
        const scale = startScale + (endScale - startScale) * Math.pow(t, 0.5);

        // Update physics body
        const factor = scale / (chipBody.render._lastScale || startScale);
        Matter.Body.scale(chipBody, factor, factor);
        chipBody.render._lastScale = scale;

        // Update sprite scale for visual
        if (chipBody.render.sprite) {
            chipBody.render.sprite.xScale = scale;
            chipBody.render.sprite.yScale = scale;
        }

        // Compute a small push
        // const angle = Math.random() * Math.PI * 2;
        // const magnitude = 1; // e.g., 0.5 - 2 depending on scale
        // Matter.Body.applyForce(chipBody, chipBody.position, {
        //     x: Math.cos(angle) * magnitude,
        //     y: Math.sin(angle) * magnitude
        // });

        if (t < 1) {
            // createShockwave(chipBody, 200, 0.05, false);
            requestAnimationFrame(animate);
        } else {
            // Apply random explosion force
            createShockwave(chipBody, 1000, 1.5);
            shakeScreen();
            // Fade out (if you want) and then remove
            Matter.Composite.remove(engine.world, chipBody);
        }
    }

    requestAnimationFrame(animate);
}





//////////////////// ^^^^^^^^^^^^^

drawBtn.addEventListener('click', () => regularPull());
potionBtn.addEventListener('click', usePotion);
logBtn.addEventListener('click', () => 
    showConfirmSplash({ // Show the log
        title: "Action Log:",
        message: [...game.lobby.actionLog,['','End of log']].map(a => `<div class="log-row"><div>${a[0]}</div><div style="color:${a[2]};">${a[1]}</div></div>`).join(''),
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
});


// Button to end round, buy chips, and restart round ===========================
endBtn.addEventListener('click', () => // Initial confirmation to end round
    showConfirmSplash({
        title: "End Round?",
        message: "Are you sure you want to end the round? This can't be undone.",
        cancelText: "Cancel",
        confirmText: "Yes, End Round",
        onConfirm: () => placeSavedReds(),
        holdToConfirm: false
    })
);
// Do witch card peek at end of round
// Do greens that need exactly 7 white
// Place any red chips (variant B) that were saved
function placeSavedReds() {
    if (game.lobby.variant.red != 'B' || game.chips.redSaved.length == 0) {
        enterSummaryPhase()
    } else {
        writeToLog(`Placing saved red chips`, chipColors.red);
    showSelectorSplash({
        title: "Placing Saved Red Chips",
        message: "You may place all these chips",
        confirmText: "Place",
        holdToConfirm: false,
        chipsToSelect: [game.chips.redSaved],
        maxSelect: 99,
        showGold: false,
        showTrack: true,
        onConfirm: (selectedChips) => {
            selectedChips.forEach(c => placeChip(c)) // Place selected chips
            game.chips.redSaved = game.chips.redSaved.filter(c => !selectedChips.includes(c));
            enterSummaryPhase()
        }
    });
    }
}
// Do end of round summary
function enterSummaryPhase() {
    const overlay = quickElement("div","confirm-overlay");
    const box = quickElement("div","confirm-box");
    const titleElem = quickElement("h2","confirm-title","End of Round");
    box.appendChild(titleElem);
    
    const msgElem = quickElement("p","confirm-message","You get E!")
    box.appendChild(msgElem);

    let endOptions = {
        green: game.track.placed.filter((c,i) => c.color == 'green' && i > game.track.placed.length-3 && game.lobby.variant.green != 'C').length,
        purple: Math.min(3, game.track.placed.filter((c) => c.color == 'purple' && game.lobby.variant.purple != 'C').length),
        black: game.track.placed.filter((c) => c.color == 'black').length
    }

    function disableButton(button, row) {
        row.removeChild(button);
        row.appendChild(createButton({ buttonText:"Already done", buttonColor:"grey" }));
    }

            // A:{ 1:4, 2:8, 4:14 },  // ruby
            // B:{ 1:6, 2:11, 4:18 }, // free chip
            // C:{ 1:6, 2:11, 4:21 }, // seven white
            // D:{ 1:4, 2:8, 4:14 },  // ruby swap
    const greenRow = quickElement("div","confirm-buttons");
    const greenElem = quickElement("div","chip",endOptions.green); greenElem.style.backgroundColor = chipColors.green;
    greenRow.appendChild(greenElem);
    if (endOptions.green) {
        const buttonText = { A:"Receive Bonus!", B:"Receive Bonus!", D:'Pay 1 <img src="ui/ruby.png" class="textRuby"</img> ruby to move droplet?' };
        const greenBtn = createButton({
            buttonText: buttonText[game.lobby.variant.purple],
            onClick: () => {
                if (game.lobby.variant.green == "A") {
                    showConfirmSplash({
                        message: "You get rubies",
                        confirmText: "",
                        cancelText: "Ok"
                    });
                    endOptions.green = 0;  disableButton(greenBtn,greenRow);
                } else if (game.lobby.variant.green == "B") {
                    showConfirmSplash({
                        message: "You get free chip",
                        confirmText: "",
                        cancelText: "Ok"
                    });
                    endOptions.green = 0;  disableButton(greenBtn,greenRow);
                } else if (game.lobby.variant.green == "D") {
                    showConfirmSplash({
                        message: "Your droplet has been moved.",
                        cancelText: "Go back",
                        confirmText: "Pay 1 ruby",
                        holdToConfirm: true,
                        onConfirm: () => {
                            endOptions.green -= 1;
                            game.player.droplet.value += 1;
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
        if (game.lobby.variant.green == 'C') {
            greenElem.textContent = game.track.placed.filter((c,i) => c.color == 'green').length;
            greenRow.appendChild(createButton({ buttonColor:"grey",
                buttonText: (game.chips.totalWhite==7) ? "Green chips doubled!" : "Need exactly 7 white" }));
        } else {
            greenRow.appendChild(createButton({ buttonText:"No green chips", buttonColor:"grey" }));
        }
    }
    box.appendChild(greenRow);
    
    const purpleRow = quickElement("div","confirm-buttons");
    const purpleElem = quickElement("div","chip",endOptions.purple); purpleElem.style.backgroundColor = chipColors.purple;
    purpleRow.appendChild(purpleElem);
    if (endOptions.purple) {
        const buttonText = { A:"Receive Bonus!", B:`Trade in ${endOptions.purple} purple chips?`, D:"Upgrade a Chip!" };
        const purpleBtn = createButton({
            buttonText: buttonText[game.lobby.variant.purple],
            onClick: () => {
                if (game.lobby.variant.purple == "A") {
                    if (endOptions.purple == 3) game.player.droplet.value += 1;
                    endOptions.purple = 0;  disableButton(purpleBtn, purpleRow);
                    showConfirmSplash({
                        message: ( endOptions.purple == 1 ? "You get 1 victory point!" : 
                                 ( endOptions.purple == 2 ? "You get 1 victory point and a ruby!" : 
                                    "You get 2 victory points!<br><br>Your droplet has been upgraded!" )),
                        confirmText: "",
                        cancelText: "Ok"
                    });
                } else if (game.lobby.variant.purple == "B") {
                    showConfirmSplash({
                        message: ( endOptions.purple == 1 ? "Exchange 1 purple chip for 1 victory point, a ruby, and a black 1-chip?" : 
                                 ( endOptions.purple == 2 ? "Exchange 2 purple chips for 3 victory points, a droplet upgrade, a green 1-chip, and a blue 2-chip?" : 
                                    "Exchange 3 purple chips for 6 victory points, a ruby, 2 droplet upgrades, and a yellow 4-chip?" )),
                        cancelText: "Go Back",
                        confirmText: "Exchange",
                        holdToConfirm: true,
                        onConfirm: () => {
                            // Remove purple chips and grant the reward
                            if (endOptions.purple == 1) game.chips.owned.push({color:"black", value:1});
                            if (endOptions.purple == 2) { game.player.droplet.value += 1; game.chips.owned.push({color:"green", value:1}); game.chips.owned.push({color:"blue", value:2}); }
                            if (endOptions.purple == 3) { game.player.droplet.value += 2; game.chips.owned.push({color:"yellow", value:4}); }
                            while (endOptions.purple) { endOptions.purple -= 1;  game.chips.owned = game.chips.owned.filter(chip => chip != game.chips.owned.find(c => c.color === 'purple' && c.value === 1)); }
                            disableButton(purpleBtn, purpleRow);
                            showConfirmSplash({
                                message: ( endOptions.purple == 1 ? "You get 1 victory point and a ruby!<br><br>A black 1-chip is added to your bag." : 
                                        ( endOptions.purple == 2 ? "You get 3 victory points!<br><br>Your droplet has been upgraded!<br>A green 1-chip and a blue 2-chip are added to your bag." : 
                                            "You get 6 victory points and a ruby!<br><br>Your droplet has been upgraded twice!<br>A yellow 4-chip is added to your bag." )),
                                cancelText: "Ok",
                                confirmText: ""
                            });
                        }
                    });
                } else if (game.lobby.variant.purple == "D") {
                    showSelectorSplash({
                        title: "Upgrade Chip",
                        message: `You may upgrade a chip from ${endOptions.purple==2?2:1} to ${endOptions.purple==1?2:4}`,
                        confirmText: "Upgrade",
                        holdToConfirm: false,
                        chipsToSelect: [game.chips.owned.filter(c => ['red','blue','yellow','green'].includes(c.color) && c.value<(endOptions.purple==1?2:4))],
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
    
    const blackRow = quickElement("div","confirm-buttons");
    const blackElem = quickElement("div","chip",endOptions.black); blackElem.style.backgroundColor = chipColors.black;
    blackRow.appendChild(blackElem);
    if (endOptions.black) {
        const blackBtn = createButton({
            buttonText: "More than one player next to you?",
            onClick: () => {
                game.player.droplet.value += 1;
                showConfirmSplash({
                    message: "Your droplet has been moved.<br><br>If you have more black chips than both players next to you, take a ruby as well.",
                    confirmText: "",
                    cancelText: "Ok"
                });
            },
            holdToClick: true
        });
        blackRow.appendChild(blackBtn);

    } else {
        blackRow.appendChild(createButton({ buttonText:"No black chips", buttonColor:"grey" }));
    }
    box.appendChild(blackRow);

    const shopRow = quickElement("div","confirm-buttons");
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
function enterBuyPhase(gold = spaceValues[game.track.currIndex+1][0]) { // Enter the buy phase to buy 2 new chips
    writeToLog(`Ended round`);
    game.round.prevBuy.gold = gold;  game.round.prevBuy.chips = [];
    showSelectorSplash({
        title: "End of Round",
        message: `Spend up to <span class="textGold">${gold}</span> gold on 2 chips`,
        cancelText: "",
        confirmText: "Purchase",
        holdToConfirm: true,
        chipsToSelect: chipBuyOrder,
        gold: gold,
        onConfirm: (selectedChips) => {
            selectedChips.forEach(thisChip => {
                const chip = { color:thisChip.color, value:thisChip.value }; // Must be new object
                game.chips.owned.push(chip);
                game.round.prevBuy.chips.push(chip);
                writeToLog(`Bought ${thisChip.color} ${thisChip.value}-chip`, 'green');
            });
            restartRound();
        }
    });
}
function restartRound() {
    // Start the round with owned chips, except reds which were saved for the next round
    game.chips.inBag = [...game.chips.owned].filter(c => !game.chips.redSaved.includes(c));
    game.chips.redSaved = [];
    game.track.placed = [];
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
    updateWhiteCount();
    initializeBoard();
    addPhysicsChips(game.chips.inBag);
}

// Button to open witch menu and activate witch effects ===========================
witchBtn.addEventListener('click', showWitchMenu);
function showWitchMenu() {
    const overlay = quickElement("div","confirm-overlay");
    const box = quickElement("div","confirm-box");
    const titleElem = quickElement("h2","confirm-title","Witch Menu");
    box.appendChild(titleElem);
    const msgElem = quickElement("p","confirm-message","Choose an effect");
    box.appendChild(msgElem);
    const witchContainer = quickElement("div","witch-container");

    const redoButton = createButton({
        buttonText: "Re-do buy phase",
        buttonColor: chipColors.blue,
        onClick: () => {
            writeToLog(`Used witch effect to re-do last shop phase`, 'pink');
            game.round.prevBuy.chips.forEach(chip => game.chips.owned = game.chips.owned.filter(c => c != chip));
            enterBuyPhase(game.round.prevBuy.gold);
        }
    });
    witchContainer.appendChild(redoButton);

    const freeButton = createButton({
        buttonText: "Add chip to bag",
        buttonColor: chipColors.blue,
        onClick: () => showSelectorSplash({
            title: "Add chip to bag for free",
            message: "",
            confirmText: "Add chip to bag",
            holdToConfirm: true,
            chipsToSelect: chipBuyOrder,
            maxSelect: 1,
            onConfirm: (selectedChips) => {
                selectedChips.forEach(thisChip => {
                    game.chips.owned.push({ color:thisChip.color, value:thisChip.value });
                    game.chips.inBag.push({ color:thisChip.color, value:thisChip.value });
                    writeToLog(`Used witch effect to steal ${thisChip.color} ${thisChip.value}-chip`, 'pink');
                });
                document.body.removeChild(overlay);
            }
        })
    });
    witchContainer.appendChild(freeButton);

    witchContainer.appendChild(quickElement("div","confirm-message","Peek at chips in bag:"))
    const peekRow = quickElement("div","confirm-buttons");
    peekRow.style.marginTop = "-10px";
    [1,2,3,4,5].forEach(value => {
        const peekButton = createButton({
            buttonText: value,
            buttonColor: chipColors.blue,
            onClick: () => showSelectorSplash({
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
            })
        });
        peekRow.appendChild(peekButton);
    });
    witchContainer.appendChild(peekRow);

    const btnRow = quickElement("div","confirm-buttons");
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
game.track.addEventListener('click', clickOnTrack);
function clickOnTrack() {
    if (game.track.placed.length) { // If drawn chips, expand the board
        expandBoard();
    } else { // If no chips drawn, show the rat menu
        openRatMenu();
    }
}
function expandBoard() {

}
function openRatMenu() {

}

restartRound();