// Constants are initialized in this script
const mainContainer = document.getElementById('mainContainer');
mainContainer.style.maxHeight = document.documentElement.clientHeight + 'px';
const logBtn = document.getElementById('logBtn');
const rulesBtn = document.getElementById('rulesBtn');
const witchBtn = document.getElementById('witchBtn');
const endBtn = document.getElementById('endBtn');
const drawBtn = document.getElementById('drawBtn');
const potionBtn = document.getElementById('potionBtn');
const potionImg = document.getElementById('potionImg');
const whiteCounter = document.getElementById('whiteCounter');
const whiteCloud = document.getElementById('whiteCloud');
const trackActual = document.getElementById('trackActual') // The actual track. Attributes: { elements, currIndex, currElem, placed }

// ========== Chip Information ==========
const starterChips = [
    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    // { color: 'white', value: 2 },
    // { color: 'white', value: 2 },
    // { color: 'white', value: 3 },
    { color: 'green', value: 1 },
    { color: 'green', value: 1 },
    { color: 'green', value: 2 },
    { color: 'green', value: 4 },
    { color: 'green', value: 4 },
    { color: 'orange', value: 1 },

    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    { color: 'white', value: 1 },
    // { color: 'blue', value: 4 },
    // { color: 'blue', value: 4 },
    // { color: 'red', value: 4 },
    // { color: 'red', value: 4 },
];
const spaceValues = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0,1],[6,1],[7,1],[8,1],[9,1,1],[10,2],[11,2],[12,2],[13,2,1],[14,3],[15,3],[15,3,1],[16,3],[16,4],[17,4],[17,4,1],[18,4],[18,5],[19,5],[19,5,1],[20,5],[20,6],[21,6],[21,6,1],[22,7],[22,7,1],[23,7],[23,8],[24,8],[24,8,1],[25,9],[25,9,1],[26,9],[26,10],[27,10],[27,10,1],[28,11],[28,11,1],[29,11],[29,12],[30,12],[30,12,1],[31,12],[31,13],[32,13],[32,13,1],[33,14],[33,14,1],[35,15]];
const chipColors = {white:'white', black:'black', orange:'peru', green:'green', red:'firebrick', blue:'royalblue', yellow:'gold', purple:'blueviolet', droplet:'gray', rat:'gray'}
const allVariants = {
    cost: { // Cost of each chip variant: [color][variant][value]
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
        purple:{
            A:{ 1:9 },  // keep bonus
            B:{ 1:12 }, // swap bonus
            C:{ 1:10 }, // victory points
            D:{ 1:11 }, // upgrader
        },
        black:{
            A:{ 1:10 }, // 3+ players
            B:{ 1:10 }, // 2  players
        },
        orange:{
            A:{ 1:3 }, // pumpkin
        },
        white:{
            A:{ 1:0, 2:0, 3:0 }, // exploding chips
        }
    },
    desc: { // Text description of each chip variant: [color][variant][value]
        green:{
            A: {0: "After the round, if this is one of your last two chips placed, you get a ruby."},
            B: {
                0: "After the round, if this is one of your last two chips placed, you get a free 1-chip.",
                1: "After the round, if this is one of your last two chips placed, you get an orange 1-chip.",
                2: "After the round, if this is one of your last two chips placed, you get a blue or red 1-chip.",
                4: "After the round, if this is one of your last two chips placed, you get a yellow or purple 1-chip.",
            },
            C: {0: "At the end of the round, if your white chips add to exactly 7, add up all your green chips, and move your last chip that many spaces."},
            D: {0: "After the round, if this is one of your last two chips placed, you can pay a ruby to move your droplet one space."},
        },
        red:{
            A: {0: "If you've placed an orange chip, move this chip an extra space. If you've placed 3 orange chips, move an extra 2 spaces instead."},
            B: {0: "When you draw this chip, place it aside. At the end of the round, you can choose to place it, or save it for a later round."},
            C: {0: "If the previous placed chip was white, move this chip extra spaces according to that chip's value."},
            D: {0: "After you've placed a red chip, each white 1-chip is moved an additional space."},
        },
        blue:{
            A: {
                0: "After placing a blue 1/2/4-chip, peek at 1/2/4 chips from your bag. You may place one of those chips.",
                1: "After placing this chip, peek at 1 chip from your bag. You may place that chip.",
                2: "After placing this chip, peek at 2 chips from your bag. You may place one of those chips.",
                4: "After placing this chip, peek at 4 chips from your bag. You may place one of those chips.",
            },
            B: {
                0: "After placing a blue 1/2/4-chip, you are protected from busting for the next 1/2/4 chips. You still get gold and victory points, but can't roll the victory die.",
                1: "After placing this chip, you are protected from busting on the next chip. You still get gold and victory points, but can't roll the victory die.",
                2: "After placing this chip, you are protected from busting for the next 2 chips. You still get gold and victory points, but can't roll the victory die.",
                4: "After placing this chip, you are protected from busting for the next 4 chips. You still get gold and victory points, but can't roll the victory die.",
            },
            C: {0: "If you place this chip onto a ruby space, you immediately get a ruby."},
            D: {
                0: "If you place a blue 1/2/4-chip onto a ruby space, you immediately get 1/2/4 victory points.",
                1: "If you place this chip onto a ruby space, you immediately get 1 victory point.",
                2: "If you place this chip onto a ruby space, you immediately get 2 victory points.",
                4: "If you place this chip onto a ruby space, you immediately get 4 victory points.",
            },
        },
        yellow:{
            A: {0: "If the previous placed chip was white, put that white chip back into the bag."},
            B: {0: "The next chip placed is moved twice as many spaces."},
            C: {0: "After you have placed one yellow chip, the white threshold is increased to 8. If you have placed 3 yellow chips, it increases to 9."},
            D: {0: "If this is your 1st/2nd/3rd yellow chip placed, it is moved an extra 1/2/3 spaces."},
        },
        purple:{
            A: {
                0: "After the round, you get a bonus based on the amount of purple chips placed.",
                1: "After the round, if you placed 1 purple chip, you get 1 victory point.",
                2: "After the round, if you placed 2 purple chips, you get 1 victory point and a ruby.",
                3: "After the round, if you placed 3 purple chips, you get 2 victory points and a droplet upgrade.",
            },
            B: {
                0: "After the round, you may permanently trade in all the purple chips you've placed for a bonus.",
                1: "After the round, you may trade in 1 placed purple chip for: a black 1-chip, 1 victory point, and a ruby.",
                2: "After the round, you may trade in 2 placed purple chips for: a green 1-chip, a blue 2-chip, 3 victory points, and a droplet upgrade.",
                3: "After the round, you may trade in 3 placed purple chips for: a yellow 4-chip, 6 victory points, a ruby, and 2 droplet upgrades.",
            },
            C: {0: "When you place this chip, you get 0 to 3 victory points, depending on how far it is on the board."},
            D: {
                0: "After the round, if you placed 1/2/3 purple chips, you may permanently upgrade another chip's value by 1/2/3.",
                1: "After the round, if you placed 1 purple chip, you may upgrade another chip's value from 1 to 2.",
                2: "After the round, if you placed 2 purple chips, you may upgrade another chip's value from 2 to 4.",
                3: "After the round, if you placed 3 purple chips, you may upgrade another chip's value from 1 to 4.",
            },
        },
        black:{
            A: {0: "If you placed more black chips than a player next to you, move your droplet. If you have more than both players next to you, also take a ruby."},
            B: {0: "[For 2 players] If you placed as many black chips as the other player, move your droplet. If you have more, also take a ruby."},
        },
        orange:{
            A: {0: "No additional effect."},
        },
        white:{
            A: {0: "No additional effect. If your white chips add up to more than 7, you lose the round."},
        }
    },
};
const chipBuyOrder = [ // Order that the chips appear on the shop screen
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
    ],[
        { color: 'white', value: 1 },
        { color: 'white', value: 2 },
        { color: 'white', value: 3 },
    ]
];
const chipRulesOrder = [ // Order that the chips appear on the rules screen
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
        { color: 'purple', mult: 1 },
        { color: 'purple', mult: 2 },
        { color: 'purple', mult: 3 },
    ],[
        { color: 'orange', value: 1 },
        { color: 'black',  value: 1 },
        { color: 'white', value: 1 },
    ]
];