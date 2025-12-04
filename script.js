const starterChips = [
    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 1 },
    // { color: 'white', value: 2 },
    // { color: 'white', value: 2 },
    // { color: 'white', value: 3 },
    { color: 'green', value: 1 },
    { color: 'orange', value: 1 },

    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
];
const spaceValues = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0,1],[6,1],[7,1],[8,1],[9,1,1],[10,2],[11,2],[12,2],[13,2,1],[14,3],[15,3],[15,3,1],[16,3],[16,4],[17,4],[17,4,1],[18,4],[18,5],[19,5],[19,5,1],[20,5],[20,6],[21,6],[21,6,1],[22,7],[22,7,1],[23,7],[23,8],[24,8],[24,8,1],[25,9],[25,9,1],[26,9],[26,10],[27,10],[27,10,1],[28,11],[28,11,1],[29,11],[29,12],[30,12],[30,12,1],[31,12],[31,13],[32,13],[32,13,1],[33,14],[33,14,1],[35,15]];
const chipColors = {white:'white', black:'black', orange:'peru', green:'green', red:'firebrick', blue:'royalblue', yellow:'gold', purple:'blueviolet', droplet:'gray', rat:'gray'}
const allVariants = {
    cost: { // Cost of each chip variant
        green:{
            A:{ 1:4, 2:8, 4:14 },  // ruby
            B:{ 1:6, 2:11, 4:18 }, // free chip
            C:{ 1:6, 2:11, 4:21 }, // seven white
            D:{ 1:4, 2:8, 4:14 },  // ruby swap
        },
        red:{
            A:{ 1:6, 2:10, 4:16 }, // pumpkin boost
            B:{ 1:4, 2:8, 4:14 },  // end of round
            C:{ 1:5, 2:9, 4:15 },  // white boost red
            D:{ 1:7, 2:11, 4:17 }, // red boost white
        },
        blue:{
            A:{ 1:5, 2:10, 4:19 }, // peek
            B:{ 1:5, 2:10, 4:19 }, // insurance
            C:{ 1:4, 2:8, 4:14 },  // ruby
            D:{ 1:5, 2:10, 4:19 }, // victory points
        },
        yellow:{
            A:{ 1:8, 2:12, 4:18 }, // white return
            B:{ 1:9, 2:13, 4:19 }, // doubler
            C:{ 1:8, 2:12, 4:18 }, // white threshold
            D:{ 1:8, 2:12, 4:18 }, // one-two-three
        },
        orange:{
            A:{ 1:3 }, // pumpkin
        },
        black:{
            A:{ 1:10 }, // 3+ players
            B:{ 1:10 }, // 2  players
        },
        purple:{
            A:{ 1:9 },  // keep bonus
            B:{ 1:12 }, // swap bonus
            C:{ 1:10 }, // victory points
            D:{ 1:11 }, // upgrader
        },
        white:{
            A:{ 1:0, 2:0, 3:0 }, // exploding chips
        }
    },
    desc: { // Text description of each chip variant
        green:{
            A:"After the round, if this is one of your last two chips placed, you get a ruby.",
            B:"After the round, if this is one of your last two chips placed, you get an orange chip / blue-red chip / yellow-purple chip.",
            C:"At the end of the round, if your white chips add to exactly 7, add up all your green chips, and move your last chip that many spaces.",
            D:"After the round, if this is one of your last two chips placed, you can pay a ruby to move your droplet one space.",
        },
        red:{
            A:"If you have placed an orange chip, move this chip an extra space. If you have 3 orange chips, move an extra 2 spaces instead.",
            B:"Put this chip aside. At the end of the round, you can choose to place it, or save it for a later round.",
            C:"If the previous placed chip was white, move this chip extra spaces according to that chip's value.",
            D:"After you have placed one red chip, each white 1-chip is moved an additional space.",
        },
        blue:{
            A:"If you draw a blue 1/2/4-chip, peek at 1/2/4 chips from your bag. You may place one of those chips.",
            B:"If you draw a blue 1/2/4-chip, you are protected from busting for the next 1/2/4 chips. You still get gold and victory points, but can't roll the victory die.",
            C:"If you place this chip onto a ruby space, you immediately get a ruby.",
            D:"If you place a blue 1/2/4-chip onto a ruby space, you immediately get 1/2/4 victory points.",
        },
        yellow:{
            A:"If the previous placed chip was white, put that white chip back into the bag.",
            B:"The next chip placed is moved twice as many spaces.",
            C:"After you have placed one yellow chip, the white threshold is increased to 8. If you have 3 yellow chips, it increases to 9.",
            D:"If this is your 1st/2nd/3rd yellow chip placed, it is moved an extra 1/2/3 spaces.",
        },
        orange:{
            A:"No additional effect.",
        },
        black:{
            A:"If you placed more black chips than a player next to you, move your droplet. If you have more than both players next to you, also take a ruby.",
            B:"If you placed as many black chips as the other player, move your droplet. If you have more, also take a ruby.",
        },
        purple:{
            A:"After the round, if you drew 1/2/3 purple chips, you get 1 VP / 1 VP & ruby / 2 VP & droplet.",
            B:"After the round, you can trade in all the purple chips you've drawn for the bonus. xxxxxxxxxx",
            C:"When you place this chip, you get get VP for every 10 gold, rounded down. xxxxxxxxxxxxxx",
            D:"After the round, if you drew 1/2/3 purple chips, you may upgrade another chip's value by 1/2/3.",
        },
        white:{
            A:"No additional effect. If your white chips add up to more than 7, you lose the round.",
        }
    },
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

const mainContainer = document.getElementById('mainContainer');
mainContainer.style.maxHeight = document.documentElement.clientHeight + 'px';
const bagChipsContainer = document.getElementById('bagChipsContainer');
const logBtn = document.getElementById('logBtn');
const witchBtn = document.getElementById('witchBtn');
const endBtn = document.getElementById('endBtn');
const drawBtn = document.getElementById('drawBtn');
const potionBtn = document.getElementById('potionBtn');
const trackChipsContainer = document.getElementById('trackChipsContainer');
const whiteCounter = document.getElementById('whiteCounter');
const whiteOdds = document.getElementById('whiteOdds');

let trackSpaces = []; // Spaces on the board
let actionLog = []; // Text log of actions
let bagChips = [...starterChips]; // Chips in bag at start of game
let availableChips = [...bagChips]; // Chips in bag at start of each round
let drawnChips = []; // Chips placed on board
let currentSpace = 0;
let totalWhite = 0;
let totalWhiteMax = 7;
let isPotionFull = true;
let dropletStats = { color:'droplet', value:0 };
let ratStats = { color:'rat', value:0 };
let chipVariants = { green:'C', red:'A', blue:'C', yellow:'A', orange:'A', black:'A', purple:'A', white:'A' };
let chipCosts = {};
let chipDesc = {};
for (const color in chipVariants) { // List the chip costs of only the selected variants
    const variant = chipVariants[color];
    chipCosts[color] = allVariants.cost[color][variant];
    chipDesc[color] = allVariants.desc[color][variant];
}
let prevBuyPhase = { gold: 0, chips: [] };
let game = {
    lobby: {
        seed: null,
        variant: {},
    },
    round: {
        count: 1,
        prevBuy: { gold: 0, chips: [] },
    },
    player: {
        droplet: { color:'droplet', value:0 },
        rat: { color:'rat', value:0 },
        potion: true,
    },
    chips: {
        owned: [...starterChips],
        inBag: [...starterChips],
        cost: {},
        desc: {},
    },
    track: {
        elements: [],
        currIndex: 0,
        currElem: null,
        nextElem: null,
    },
};

function initializeBoard() {
    currentSpace = 0;
    trackSpaces = [];
    trackChipsContainer.innerHTML = '';
    spaceValues.forEach((_,index) => {
        const newSpace = document.createElement('div');
        trackSpaces.push(newSpace);
        resetTrackSpace(index);
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
    if (availableChips.length === 0 || totalWhite > totalWhiteMax || currentSpace == trackSpaces.length-1) return;
    if (multiDraw) {
        const arr = [...availableChips.keys()]; // [0,1,2,...]
        arr.forEach((_, i) => { const j = Math.floor(Math.random() * (i + 1));  [arr[i], arr[j]] = [arr[j], arr[i]] });
        return arr.slice(0, multiDraw).map(i => availableChips[i]); // Return array of chips
    } else { // Return one index
        const index = Math.floor(Math.random() * availableChips.length);
        return availableChips[index];
    }
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
function placeChip(chip) {
    if (chip == undefined) return;
    // Calculate chip effects
    let spaces = chip.value;
    if (chip.color == 'red' && chipVariants.red == 'A' && drawnChips.filter(c => c.color=='orange').length > 0) spaces += 1;
    if (chip.color == 'red' && chipVariants.red == 'A' && drawnChips.filter(c => c.color=='orange').length > 2) spaces += 1;
    if (chip.color == 'red' && chipVariants.red == 'C' && drawnChips[drawnChips.length-2]?.color == 'white') spaces += drawnChips[drawnChips.length-2]?.value;
    if (chip.color == 'white' && chipVariants.red == 'D' && chip.value == 1 && drawnChips.filter(c => c.color == 'red').length) spaces += 1;
    if (chip.color == 'yellow' && chipVariants.yellow == 'A' && drawnChips[drawnChips.length-2]?.color == 'white') yellowReturn();
    if (chip.color == 'red' && chipVariants.red == 'delayed') { redSaveForLater(chip); return; } // can't actually place later...
    // Render the chip onto the track space
    currentSpace = Math.min(trackSpaces.length-2, currentSpace+spaces);
    if (chip.color == 'blue' && chipVariants.blue == 'C' && spaceValues[currentSpace][2]) awardVPR(0,1,chip);
    if (chip.color == 'blue' && chipVariants.blue == 'D' && spaceValues[currentSpace][2]) awardVPR(chip.value,0,chip);
    const thisTrackSpace = trackSpaces[currentSpace];
    thisTrackSpace.scrollIntoView({behavior: "smooth", inline: "center"});
    thisTrackSpace.className = 'chip';
    thisTrackSpace.style.background = chipColors[chip.color];
    const rubyElem = spaceValues[currentSpace][2] ? '<img src="ui/ruby.png" class="trackRuby"</img>' : '';
    thisTrackSpace.innerHTML = `${rubyElem}${chip.value}`;
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
    })
}

function usePotion() {
    if (drawnChips.length && isPotionFull && totalWhite <= totalWhiteMax) {
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
function resetTrackSpace(index = currentSpace) {
    const space = trackSpaces[index];
    space.className = 'trackSpace';
    const rubyElem = spaceValues[index][2] ? '<img src="ui/ruby.png" class="trackRuby"</img>' : '';
    space.innerHTML = `${rubyElem}<div class="trackGold">${spaceValues[index][0]}</div><div class="trackVP">${spaceValues[index][1]}</div>`;
    space.style.background = '';
}
function updateWhiteCount() {
    totalWhite = drawnChips.filter(c => c.color === 'white').reduce((sum, c) => sum + c.value, 0);
    whiteCounter.innerHTML = `${totalWhite}/${totalWhiteMax}`;
    if (totalWhite > totalWhiteMax) {
        writeToLog(`Pot exploded with ${totalWhite} white chips!`,chipColors.red)
        createBustForce();
        whiteOdds.innerHTML = 'BUST!';
        drawBtn.innerHTML = 'BUST!';
    } else {
        const odds = Math.ceil(availableChips.filter(c => c.color === 'white').reduce((canBust, c) => canBust + ((c.value + totalWhite) > totalWhiteMax), 0)/availableChips.length*100);
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

//////////////////// vvvvvvvvvvvvv
// === Setup Matter.js ===

const canvas = document.getElementById("chipsCanvas");

// Make sure parent has been laid out
function resizeCanvasToParent() {
    const parent = canvas.parentElement;
    const width  = parent.clientWidth;
    const height = parent.clientHeight;
    // device pixel ratio (2 for most phones, 1 for normal monitors)
    const ratio = 2 || window.devicePixelRatio || 1;
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
const render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        wireframes: false,
        background: "#252129",
        width: canvas.width,
        height: canvas.height,
        // antiAlias: true
    }
});

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
                    texture: "chips/chip-test.png",
                    xScale: 1/2,
                    yScale: 1/2
                }
            }
        }
    );
    Matter.Composite.add(world, chipBody);
    return chipBody;
}
function createShockwave(originBody, radius = 400, forceMagnitude = 0.04) {
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
function createBustForce(forceMagnitude = 0.3) {
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        Matter.Body.applyForce(body, body.position, { x:0, y:forceMagnitude*(0.7+Math.random()*0.6) });
    });
}

//////////////////// ^^^^^^^^^^^^^

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
        onConfirm: () => enterSummaryPhase(),
        holdToConfirm: false
    })
);
// Do witch card peek at end of round
// Do greens that need exactly 7 white
// Do delayed reds
// Do end of round summary
function enterSummaryPhase() {
    const overlay = quickElement("div","confirm-overlay");
    const box = quickElement("div","confirm-box");
    const titleElem = quickElement("h2","confirm-title","End of Round");
    box.appendChild(titleElem);
    
    const msgElem = quickElement("p","confirm-message","You get E!")
    box.appendChild(msgElem);

    let endOptions = {
        green: drawnChips.filter((c,i) => c.color == 'green' && i > drawnChips.length-3 && chipVariants.green != 'C').length,
        purple: drawnChips.filter((c) => c.color == 'purple').length,
        black: drawnChips.filter((c) => c.color == 'black').length
    }

    const greenRow = quickElement("div","confirm-buttons");
    const greenElem = quickElement("div","chip",endOptions.green); greenElem.style.backgroundColor = chipColors.green;
    greenRow.appendChild(greenElem);
    if (endOptions.green) {
        const greenBtn = createButton({
            buttonText: 'Pay 1 <img src="ui/ruby.png" class="textRuby"</img> ruby to move droplet?',
            onClick: () => {
                endOptions.green -= 1;
                dropletStats.value += 1;
                showConfirmSplash({
                    message: "Your droplet has been moved.",
                    confirmText: "",
                    cancelText: "Ok"
                });
                if (endOptions.green < 1) {
                    greenRow.removeChild(greenBtn);
                    greenRow.appendChild(createButton({ buttonText:"Already done", buttonColor:"grey" }));
                } else {
                    greenBtn.firstChild.textContent = "Pay another ruby to move droplet again?"; // xxxxxxxxxxx
                }
            },
            holdToClick: true
        });
        greenRow.appendChild(greenBtn);
    } else { // Show a dead button
        if (chipVariants.green == 'C') {
            greenElem.textContent = drawnChips.filter((c,i) => c.color == 'green').length;
            greenRow.appendChild(createButton({ buttonColor:"grey",
                buttonText: (totalWhite==7) ? "Green chips doubled!" : "Need exactly 7 white" }));
        } else {
            greenRow.appendChild(createButton({ buttonText:"No green chips", buttonColor:"grey" }));
        }
    }
    box.appendChild(greenRow);
    
    const purpleRow = quickElement("div","confirm-buttons");
    const purpleElem = quickElement("div","chip",endOptions.purple); purpleElem.style.backgroundColor = chipColors.purple;
    purpleRow.appendChild(purpleElem);
    if (endOptions.purple) {
        const purpleBtn = createButton({
            buttonText: "Receive Bonus!",
            onClick: () => {
                dropletStats.value += 1;
                showConfirmSplash({
                    message: "You get a droplet upgrade!",
                    confirmText: "",
                    cancelText: "Ok"
                });
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
                dropletStats.value += 1;
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
function enterBuyPhase(gold = spaceValues[currentSpace+1][0]) { // Enter the buy phase to buy 2 new chips
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

// Button to expand board and open rat menu ===========================
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