//Mienflayer variable things
const mineflayer = require("mineflayer");
const pvp = require("mineflayer-pvp").plugin;
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
const armorManager = require("mineflayer-armor-manager");
const toolPlugin = require('mineflayer-tool').plugin
let mcData;

//Bot modes
let killerMode = false;
let killerModeMob = false;
let isWandering = false;

//Initialize bot
let bot = mineflayer.createBot({
    username: "NAV-Merkur2",
    host: "kaka-tKz1.aternos.me",
    port: 21696
});

//Load bot plugins
bot.loadPlugin(toolPlugin);
bot.loadPlugin(armorManager);
bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);

//Initialized pathfinder and mcdata variable
bot.once("spawn", () => {
    const defaultMove = new Movements(bot);

    defaultMove.canOpenDoors = true;
    defaultMove.allowParkour = true;
    defaultMove.allow1by1towers = false;
    defaultMove.allowEntityDetection = true;

    bot.pathfinder.setMovements(defaultMove);
    mcData = require("minecraft-data")(bot.version);
});

//Bot eating when hp low
bot.on("health", async() => {
    if (bot.health < 12) {
        const goldenApple = findFood();

        if (goldenApple) {
            try {
                await bot.pvp.stop();
                await bot.equip(goldenApple, 'hand');
                await bot.consume();
            }catch (err) {
                console.log(err);
            }
        }
    }
})

//bot whisper commands
bot.on("whisper", (username, message) => {
    //Splits the message
    let args = message.split(" ");

    bot.chat("/w Levi555"+args[1])

    if (args[0] === "kiholplr") {
        kiholplr(args[1]);
    }

    if (args[0] === "attack") {
        attack(args[1]);
    }

    if (args[0] === "killermode") {
        KillerModeOn();
    }

    if (args[0] === "killermodeoff") {
        KillerModeOff();
    }

    if (args[0] === "killermodemob") {
        KillerModeOnMob();
    }

    if (args[0] === "killermodemoboff") {
        KillerModeOffMob();
    }

    if (args[0] === "wanderon") {
        WanderOn();
    }

    if (args[0] === "wanderoff") {
        WanderOff();
    }
})

//RandomValue Generator
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function WanderOn(){
    isWandering = true;
}

function WanderOff(){
    isWandering = false;
}

//Wandering botmode (Select a random position and goes to it)
async function Wandering() {

    if (!bot.pathfinder.isMoving() && bot.pathfinder. && !bot.pvp.target) {
        //Getting Random positions in the world
        const RandPosX = randomNumber(-500, 500);
        const PosY = 70;
        const RandPosZ = randomNumber(-500, 500);

        try {
            await bot.pathfinder.setGoal(new GoalNear(RandPosX, PosY, RandPosZ));
        }catch (err){
            console.log(err);
        }
    }else if(!bot.pvp.target) {
        bot.pathfinder.stop();
    }
}

//Get Golden Apple
function findFood() {
    return bot.inventory.items().find(item => item.name.includes("cooked") || item.name.includes("apple"));
}

//Set bot mode into killing players
function KillerModeOn() {
    const sword = findSword();

    killerMode = true;

    if (sword) {
        bot.equip(sword, 'hand');
    }
}

//Set bot killermodemob mode off;
function KillerModeOffMob() {
    killerModeMob = false;
}

//Set bot killermodebot mode on;
function KillerModeOnMob() {
    const sword = findSword();

    killerModeMob = true;

    if (sword) {
        bot.equip(sword, 'hand');
    }
}

//Set bot killermode mode off
function KillerModeOff() {
    killerMode = false;
    if (bot.pvp.target)
    {
        bot.pvp.stop();
    }
}

//return a sword item from the inventory
function findSword() {
    const swordNames = [
        'wooden_sword',
        'stone_sword',
        'iron_sword',
        'golden_sword',
        'diamond_sword',
        'netherite_sword'
    ];

    return bot.inventory.items().find(item => swordNames.includes(item.name));
}

//Killermode and ai behaviour
bot.on('physicsTick', () => {
    if (killerModeMob)
        KillermodeMob();
    if (killerMode)
        Killermode();
    if (isWandering)
        Wandering();
});

//Killermode function
async function Killermode()
{
    if (bot.health > 12) {
        const enemy = bot.nearestEntity(e => e.type === "player" && e.mobType !== 'Armor Stand');

        if (enemy) {
            if (!bot.pvp.target) {
                try {
                    await bot.pvp.attack(enemy);
                }catch(err) {
                    console.log(err);
                }
            }
        }

        const sword = findSword();

        if (sword && bot.health > 12) {
            await bot.equip(sword, 'hand');
        }
    }else {
        await bot.pvp.stop();
    }
}

async function KillermodeMob()
{
    if (killerModeMob && bot.health > 12) {
        const filter = e => e.type === "hostile" && e.mobType !== 'Armor Stand' && bot.entity.position.distanceTo(e.position) < 16;
        const enemy = bot.nearestEntity(filter);

        if (enemy) {
            if (!bot.pvp.target) {
                try {
                    await bot.pvp.attack(enemy);
                }catch(err) {
                    console.log(err);
                }
            }
        }

        const sword = findSword();

        if (sword && bot.health > 12) {
            await bot.equip(sword, 'hand');
        }
    }else {
        await bot.pvp.stop();
    }
}

//Gets the player position and send it to you
function kiholplr(username) {
    try {
        let entity = bot.players[username];

        if (entity) {
            bot.chat("/w Levi555 " + entity.entity.position + " name: " + entity.displayName.toString());
            bot.chat("/w Konyhas_Him " + entity.entity.position + " name: " + entity.displayName.toString());
        }
    }catch(err) {
        console.log(err);
    }
}

//attack the give player
function attack(username) {
    let enemy = bot.players[username];

    if (enemy) {
        bot.pvp.attack(enemy.entity);
    }
}
//