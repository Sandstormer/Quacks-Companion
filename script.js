const starterChips = [
    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    { color: 'white', value: 2 },
    { color: 'white', value: 2 },
    { color: 'white', value: 3 },
    { color: 'green', value: 1 },
    { color: 'orange', value: 1 },

    // { color: 'yellow', value: 1 },
    // { color: 'yellow', value: 2 },
    // { color: 'yellow', value: 4 },
    // { color: 'yellow', value: 1 },
    // { color: 'yellow', value: 2 },
    // { color: 'yellow', value: 4 },
    // { color: 'yellow', value: 1 },
    // { color: 'yellow', value: 2 },
    // { color: 'yellow', value: 4 },
    // { color: 'blue', value: 1 },
    // { color: 'blue', value: 2 },
    // { color: 'blue', value: 4 },
    // { color: 'blue', value: 1 },
    // { color: 'blue', value: 2 },
    // { color: 'blue', value: 4 },
    // { color: 'blue', value: 1 },
    // { color: 'blue', value: 2 },
    // { color: 'blue', value: 4 },

    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },

    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
    // { color: 'red', value: 1 },
];
const spaceValues = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0,1],[6,1],[7,1],[8,1],[9,1,1],[10,2],[11,2],[12,2],[13,2,1],[14,3],[15,3],[15,3,1],[16,3],[16,4],[17,4],[17,4,1],[18,4],[18,5],[19,5],[19,5,1],[20,5],[20,6],[21,6],[21,6,1],[22,7],[22,7,1],[23,7],[23,8],[24,8],[24,8,1],[25,9],[25,9,1],[26,9],[26,10],[27,10],[27,10,1],[28,11],[28,11,1],[29,11],[29,12],[30,12],[30,12,1],[31,12],[31,13],[32,13],[32,13,1],[33,14],[33,14,1],[35,15]];
const chipColors = {white:'white', black:'black', orange:'peru', green:'green', red:'firebrick', blue:'royalblue', yellow:'gold', purple:'blueviolet', droplet:'gray', rat:'gray'}
const chipAllVariants = {
    green:{
        A:{ 1:8, 2:13, 4:22 },
        B:{ 1:9, 2:15, 4:24 }
    },
    red:{
        A:{ 1:6, 2:10, 4:18 }
    },
    blue:{
        A:{ 1:6, 2:11, 4:20 }
    },
    yellow:{
        A:{ 1:8, 2:10, 4:18 }
    },
    orange:{
        A:{ 1:3 }
    },
    black:{
        A:{ 1:10 },
        B:{ 1:10 }
    },
    purple:{
        A:{ 1:11 }
    },
    white:{
        A:{ 1:0, 2:0, 3:0 }
    }
};
const chipBuyOrder = [
    [
        { color: 'green', value: 1 },
        { color: 'green', value: 2 },
        { color: 'green', value: 4 },
    ],[
        { color: 'red', value: 1 },
        { color: 'red', value: 2 },
        { color: 'red', value: 4 },
    ],[
        { color: 'blue', value: 1 },
        { color: 'blue', value: 2 },
        { color: 'blue', value: 4 },
    ],[
        { color: 'yellow', value: 1 },
        { color: 'yellow', value: 2 },
        { color: 'yellow', value: 4 },
    ],[
        { color: 'orange', value: 1 },
        { color: 'black',  value: 1 },
        { color: 'purple', value: 1 },
    ]
];
let chipVariants = { green:'A', red:'A', blue:'A', yellow:'A', orange:'A', black:'A', purple:'A', white:'A' };
let chipCosts = {};
for (const color in chipVariants) { // List the chip costs of only the selected variants
    const variant = chipVariants[color];
    chipCosts[color] = chipAllVariants[color][variant];
}
let prevBuyPhase = {gold: 0, chips: []};

const mainContainer = document.getElementById('mainContainer');
mainContainer.style.maxHeight = document.documentElement.clientHeight + 'px';
const bagChipsContainer = document.getElementById('bagChipsContainer');
const drawnChipsContainer = document.getElementById('drawnChipsContainer');
const logBtn = document.getElementById('logBtn');
const witchBtn = document.getElementById('witchBtn');
const endBtn = document.getElementById('endBtn');
const drawBtn = document.getElementById('drawBtn');
const potionBtn = document.getElementById('potionBtn');
const splashBtn = document.getElementById('splashBtn');
const trackChipsContainer = document.getElementById('trackChipsContainer');
const whiteCounter = document.getElementById('whiteCounter');
const whiteOdds = document.getElementById('whiteOdds');
const splashScreen = document.getElementById('splashScreen');
const splashScrollable = document.getElementById('splashScrollable');

let trackSpaces = []; // Spaces on the board
let actionLog = []; // Text log of actions
let bagChips = [...starterChips]; // Chips in bag at start of game
let availableChips = [...bagChips]; // Chips in bag at start of each round
let drawnChips = []; // Chips placed on board
let currentSpace = 0;
let currentWhite = 0;
let currentWhiteMax = 7;
let potionFilled = true;
let dropletStats = { color:'droplet', value:0 };
let ratStats = { color:'rat', value:0 };

function initializeBoard() {
    currentSpace = 0;
    trackSpaces = [];
    trackChipsContainer.innerHTML = '';
    spaceValues.forEach(thisValue => {
        const newSpace = document.createElement('div');
        newSpace.className = 'trackSpace';
        newSpace.gold = thisValue[0];
        newSpace.vicPts = thisValue[1];
        newSpace.innerHTML = `<div class="trackGold">${newSpace.gold}</div><div class="trackVP">${newSpace.vicPts}</div>`;
        trackSpaces.push(newSpace);
        trackChipsContainer.appendChild(newSpace);
    });
    placeChip(dropletStats);
    if (ratStats.value) {
        placeChip(ratStats);
    }
}

function regularPull() {
    if (document.querySelector(".confirm-overlay")) return; // Can't pull if there is an overlay
    const grabbedChip = grabChipFromBag()
    const chip = removeChipFromBag(grabbedChip);
    placeChip(chip);
}
function grabChipFromBag(multiDraw = 0) {
    if (availableChips.length === 0 || currentWhite > currentWhiteMax || currentSpace == trackSpaces.length-1) return;
    if (multiDraw) {
        const arr = [...availableChips.keys()]; // [0,1,2,...]
        arr.forEach((_, i) => { const j = Math.floor(Math.random() * (i + 1));  [arr[i], arr[j]] = [arr[j], arr[i]] });
        return arr.slice(0, multiDraw).map(i => availableChips[i]); // Return array of chips
    } else { // Return one index
        const index = Math.floor(Math.random() * availableChips.length);
        return availableChips[index];
    }
}
function placeChip(chip) {
    if (chip == undefined) return;
    // Calculate chip effects
    let spaces = chip.value;
    if (chip.color == 'red' && chipVariants.red == 'A' && drawnChips.filter(c => c.color=='orange').length > 0) spaces += 1;
    if (chip.color == 'red' && chipVariants.red == 'A' && drawnChips.filter(c => c.color=='orange').length > 2) spaces += 1;
    if (chip.color == 'yellow' && chipVariants.yellow == 'A' && drawnChips[drawnChips.length-2]?.color == 'white') yellowReturn();
    if (chip.color == 'red' && chipVariants.red == 'delayed') { redSaveForLater(chip); return; } // can't actually place later...
    // Render the chip onto the track space
    currentSpace = Math.min(trackSpaces.length-2, currentSpace+spaces);
    const thisTrackSpace = trackSpaces[currentSpace];
    thisTrackSpace.scrollIntoView({behavior: "smooth", inline: "center"});
    thisTrackSpace.className = 'chip';
    thisTrackSpace.style.background = chipColors[chip.color];
    thisTrackSpace.textContent = chip.value;
    updateWhiteCount();
    if (chip.color == 'blue' && chipVariants.blue == 'A') bluePeeking(chip.value);
}
function bluePeeking(value) { // Peek at multiple chips, and you may place one
    writeToLog(`Blue effect peeked at ${value} chips`, chipColors.blue);
    showSelectorSplash({
        title: "Blue Effect",
        message: "You may place 1 chip in your pot",
        holdToConfirm: false,
        chipsToSelect: [grabChipFromBag(value)],
        maxSelect: 1,
        showGold: false,
        onConfirm: (selectedChips) => {console.log(selectedChips);placeChip(removeChipFromBag(selectedChips[0]))} // Place selected chip
    });
}
function yellowReturn() {
    resetTrackSpace(currentSpace);
    const [chip] = drawnChips.splice(drawnChips.length-2,1);
    writeToLog(`Yellow effect returned ${chip.color} ${chip.value}-chip`, chipColors.yellow);
    chip.body = spawnChip(chip.color, chip.value)
    availableChips.push(chip);
}

function usePotion() {
    if (drawnChips.length && potionFilled && currentWhite <= currentWhiteMax) {
        // potionFilled = false;
        // Reset the display of the track space
        resetTrackSpace(currentSpace);
        currentSpace = trackSpaces.map(e => e.className).lastIndexOf("chip");
        trackSpaces[currentSpace].scrollIntoView({behavior: "smooth", inline: "center"});
        // Put chip back into bag
        const chip = drawnChips.pop();
        chip.body = spawnChip(chip.color, chip.value)
        availableChips.push(chip);
        writeToLog(`Used potion on ${chip.color} ${chip.value}-chip`);
        updateWhiteCount();
    }
}
function resetTrackSpace(index) {
    const space = trackSpaces[currentSpace];
    space.className = 'trackSpace';
    space.innerHTML = `<div class="trackGold">${spaceValues[currentSpace][0]}</div><div class="trackVP">${spaceValues[currentSpace][1]}</div>`;
    space.style.background = '';
}
function updateWhiteCount() {
    currentWhite = drawnChips.filter(c => c.color === 'white').reduce((sum, c) => sum + c.value, 0);
    whiteCounter.innerHTML = `${currentWhite}/${currentWhiteMax}`;
    if (currentWhite > currentWhiteMax) {
        writeToLog(`Pot exploded with ${currentWhite} white chips!`,chipColors.red)
        createBustForce();
        whiteOdds.innerHTML = 'BUST!';
        drawBtn.innerHTML = 'BUST!';
    } else {
        const odds = Math.ceil(availableChips.filter(c => c.color === 'white').reduce((canBust, c) => canBust + ((c.value + currentWhite) > currentWhiteMax), 0)/availableChips.length*100);
        whiteOdds.innerHTML = `${odds}%`;
        drawBtn.innerHTML = 'Draw Chip';
    };
}

function writeToLog(actionString, color = "white") {
    const now = new Date();
    let timeString = now.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    timeString = timeString.replace(/\s?[AP]M/i, ''); // remove AM/PM
    actionLog.push([timeString,actionString,color]);
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
    onConfirm = () => {},
    holdToConfirm = false,
    chipsToSelect = null,
    maxSelect = 2,
    gold = 100,
    showGold = true,
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
        if (numSelected != 0 && showGold) confirmBtn.firstChild.textContent = `Buy ${numToText(numSelected)}`;
        if (numSelected != 0 && !showGold) confirmBtn.firstChild.textContent = `Place ${numToText(numSelected)}`;
    };

    if (title) box.appendChild(titleElem);
    if (message) box.appendChild(msgElem);
    btnRow.appendChild(confirmBtn);
    
    const chipList = quickElement("div","chip-selector");
    chipsToSelect.forEach(thisBuyRow => {
        const chipRow = quickElement("div","chip-selector-row");

        thisBuyRow.forEach(chip => {
            const itemDiv = quickElement("div","chip-selector-item");
            const chipIcon = quickElement("div","chip",chip.value);
            chipIcon.style.background = chipColors[chip.color];
            itemDiv.appendChild(chipIcon);
            
            const cost = chipCosts[chip.color][chip.value];
            const goldIcon = quickElement("div","trackGold",cost);
            if (showGold) itemDiv.appendChild(goldIcon)

            chipRow.appendChild(itemDiv);
            itemDiv.addEventListener("click", () => {
                if (selectedChips.includes(chip)) { // Unselect
                    selectedChips = selectedChips.filter(x => x !== chip);
                    itemDiv.classList.remove("selected");
                } else { // Select if possible
                    if (maxSelect == 1) { // Swap single selection
                        if (cost > gold) {
                            flashRed(itemDiv);
                        } else {
                            chipList.querySelectorAll('.chip-selector-item').forEach(e => e.classList.remove('selected'));
                            selectedChips = [chip];
                            itemDiv.classList.add("selected");
                        }
                    } else if ( (selectedChips.length >= maxSelect) // Limit amount
                        || (cost + selectedChips.reduce((sum, c) => sum + chipCosts[c.color][c.value], 0) > gold) // Need enough gold
                        || (selectedChips.some(c => c.color == chip.color)) ) { // No same color
                            flashRed(itemDiv);
                    } else { // Add chip to selected
                        selectedChips.push(chip);
                        itemDiv.classList.add("selected");
                    }
                }
                confirmBtn.updateText(selectedChips.length);
            });
        });
        chipList.appendChild(chipRow);
    });
    box.appendChild(chipList);

    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
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

// Button to end round, buy chips, and restart round ===========================
endBtn.addEventListener('click', () =>
    showConfirmSplash({
        title: "End Round?",
        message: "Are you sure you want to end the round? This can't be undone.",
        cancelText: "Cancel",
        confirmText: "Yes, End Round",
        onConfirm: () => enterBuyPhase(),
        holdToConfirm: false
    })
);
function enterBuyPhase(gold = trackSpaces[currentSpace+1].gold) {
    writeToLog(`Ended round`);
    prevBuyPhase.gold = gold;  prevBuyPhase.chips = [];
    showSelectorSplash({
        title: "End of Round",
        message: `Spend up to <span class="msgGold">${gold}</span> gold on 2 chips`,
        cancelText: "",
        confirmText: "Purchase",
        holdToConfirm: true,
        chipsToSelect: chipBuyOrder,
        gold: gold,
        onConfirm: (selectedChips) => {
            selectedChips.forEach(thisChip => {
                const chip = { color:thisChip.color, value:thisChip.value }; // Must be new object
                bagChips.push(chip);
                prevBuyPhase.chips.push(chip);
                writeToLog(`Bought ${thisChip.color} ${thisChip.value}-chip`, 'green');
            });
            restartRound();
        }
    });
}
function restartRound() {
    availableChips = [...bagChips];
    drawnChips = [];
    Matter.Composite.clear(world, false);
    const wallProperties = { isStatic: true, render: { visible: false } };
    const walls = [ // rectangle(x_center, y_center, width, height, options)
        Matter.Bodies.rectangle(canvas.width / 2, canvas.height + 20, canvas.width, 40, wallProperties), // floor
        Matter.Bodies.rectangle(-20, 0, 40, canvas.height*2, wallProperties), // left
        Matter.Bodies.rectangle(canvas.width + 20, 0, 40, canvas.height*2, wallProperties) // right
    ];
    Matter.Composite.add(world, walls);
    updateWhiteCount();
    initializeBoard();
    addPhysicsChips(availableChips);
}
//////////////////// vvvvvvvvvvvvv
// === Setup Matter.js ===

const canvas = document.getElementById("chipsCanvas");

// Make sure parent has been laid out
function resizeCanvasToParent() {
    const parent = canvas.parentElement;
    const width  = parent.clientWidth;
    const height = parent.clientHeight;

    // CSS size
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Internal drawing buffer
    canvas.width = width;
    canvas.height = height;

    // Update Matter.Render size if renderer exists
    if (typeof render !== "undefined") {
        render.options.width = width;
        render.options.height = height;
    }
}

// --- Matter.js setup ---
const engine = Matter.Engine.create();
const world = engine.world;
const render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        wireframes: false,
        background: "#252129",
        width: canvas.width,
        height: canvas.height
    }
});

resizeCanvasToParent(); // Initial resize (after DOM is ready)
window.addEventListener("resize", resizeCanvasToParent); // Update on window resize

const runner = Matter.Runner.create();
Matter.Render.run(render);
Matter.Runner.run(runner, engine);

// --- Sequential chip spawning ---
function addPhysicsChips(chips) {
    let delay = 220;
    let cumulative = 0;
    const accel = 0.92;
    chips.forEach(chip => {
        setTimeout(() => { // Only spawn in not already drawn from bag
            if (availableChips.includes(chip)) chip.body = spawnChip(chip.color, chip.value); 
        }, cumulative );
        delay *= accel;
        cumulative += delay;
    });
}
// --- Chip spawning ---
function spawnChip(color, value) {
    const radius = 32;
    const chipBody = Matter.Bodies.circle(
        Math.random() * (canvas.width - radius*2) + radius,
        -100 - Math.random() * 300,
        radius,
        {
            restitution: 0.95,
            friction: 0.1,
            frictionAir: 0.01,
            render: {
                fillStyle: chipColors[color],
                text: { content: value, color: "black", size: 20 }
            }
        }
    );
    Matter.Composite.add(world, chipBody);
    return chipBody;
}
function createShockwave(originBody, radius = 200, forceMagnitude = 0.02) {
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        if (body === originBody) return;
        const dx = body.position.x - originBody.position.x;
        const dy = body.position.y - originBody.position.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < radius) {
            const normalX = dx / dist;
            const normalY = dy / dist;
            const force = { x: normalX * forceMagnitude, y: normalY * forceMagnitude };
            Matter.Body.applyForce(body, body.position, force);
        }
    });
}
function createBustForce(forceMagnitude = 0.15) {
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        Matter.Body.applyForce(body, body.position, { x:0, y:forceMagnitude*(0.7+Math.random()*0.6) });
    });
}
function removeChipFromBag(chip) {
    if (chip == undefined) return;
    availableChips = availableChips.filter(c => c != chip); // Remove chip from current bag
    if (chip.body) {
        Matter.Composite.remove(world, chip.body); // Remove physics chip from world
        createShockwave(chip.body, 150, 0.03);
    }
    writeToLog(`Placed ${chip.color} ${chip.value}-chip`);
    drawnChips.push(chip);
    return chip;
}

//////////////////// ^^^^^^^^^^^^^
function renderDrawnChips(chips) {
    drawnChipsContainer.innerHTML = '';
    chips.forEach(chip => {
        const newChip = document.createElement('div');
        newChip.className = 'chip';
        newChip.style.background = chipColors[chip.color];
        newChip.textContent = chip.value;
        drawnChipsContainer.appendChild(newChip);
    });
}

drawBtn.addEventListener('click', () => regularPull());
potionBtn.addEventListener('click', usePotion);
logBtn.addEventListener('click', () => 
    showConfirmSplash({ // Show the log
        title: "Action Log:",
        message: actionLog.map(a => `<div class="log-row"><div>${a[0]}</div><div style="color:${a[2]};">${a[1]}</div></div>`).join(''),
        cancelText: "Return to game",
        confirmText: "",
        holdToConfirm: false
    })
);
splashBtn.addEventListener('click', () => splashScreen.classList.remove("show"));
document.addEventListener('keydown', (event) => {
    if (event.key == " ") {
        regularPull();
        event.preventDefault();
    }
    if (event.key == "Enter") {
        event.preventDefault();
    }
});
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
            prevBuyPhase.chips.forEach(chip => bagChips = bagChips.filter(c => c != chip));
            enterBuyPhase(prevBuyPhase.gold);
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
                    bagChips.push({ color:thisChip.color, value:thisChip.value });
                    availableChips.push({ color:thisChip.color, value:thisChip.value });
                    writeToLog(`Added ${thisChip.color} ${thisChip.value}-chip for free`, 'pink');
                });
                document.body.removeChild(overlay);
            }
        })
    });
    witchContainer.appendChild(freeButton);

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
trackChipsContainer.addEventListener('click', clickOnTrack);
function clickOnTrack() {
    if (drawnChips.length) { // If drawn chips, expand the board
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