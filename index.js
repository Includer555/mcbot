const mineflayer = require("mineflayer");
const pvp = require("mineflayer-pvp").plugin;
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
const armorManager = require("mineflayer-armor-manager");
const toolPlugin = require('mineflayer-tool').plugin
let mcData;

let killerMode = false;
let killerModeMob = false;

let bot = mineflayer.createBot({
    username: "NAV-Merkur2",
    host: "kaka-tKz1.aternos.me",
    port: 21696
});

bot.loadPlugin(toolPlugin);
bot.loadPlugin(armorManager);
bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);

function findGoldenApple() {
    return bot.inventory.items().find(item => item.name === 'golden_apple');
}

bot.once("spawn", () => {
    const defaultMove = new Movements(bot);
    defaultMove.canOpenDoors = true;
    defaultMove.allowParkour = true;
    defaultMove.allow1by1towers = false;
    defaultMove.allowEntityDetection = true;
    bot.pathfinder.setMovements(defaultMove);
    mcData = mcData = require("minecraft-data")(bot.version);
});

bot.on("health", async() => {
    if (bot.health < 12) {
        const goldenApple = findGoldenApple();

        if (goldenApple) {
            try {
                await bot.pvp.stop();
                await bot.equip(goldenApple, 'hand');
                await bot.consume();
            }catch {

            }
        }
    }
})
//faszdsa
bot.on("whisper", (username, message) => {
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
})

function KillerModeOn() {
    const sword = findSword();

    killerMode = true;

    if (sword) {
        bot.equip(sword, 'hand');
    }
}

function KillerModeOffMob() {
    killerMode = false;
}

function KillerModeOnMob() {
    const sword = findSword();

    killerModeMob = true;

    if (sword) {
        bot.equip(sword, 'hand');
    }
}

function KillerModeOff() {
    killerModeMob = false;
    if (bot.pvp.target)
    {
        bot.pvp.stop();
    }
}

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

bot.on('physicsTick', async() => {
    if (killerMode && bot.health > 12) {
        const enemy = bot.nearestEntity(e => e.type === "player" && e.mobType !== 'Armor Stand');

        if (enemy) {
            if (!bot.pvp.target) {
                try {
                    await bot.pvp.attack(enemy);
                }catch(err) {
                    
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
});

function kiholplr(username) {
    try {
        let entity = bot.players[username];

        if (entity) {
            bot.chat("/w Levi555 " + entity.entity.position + " name: " + entity.displayName.toString());
            bot.chat("/w Konyhas_Him " + entity.entity.position + " name: " + entity.displayName.toString());
        }
    }catch(err) {

    }
}

function attack(username) {
    let enemy = bot.players[username];

    if (enemy) {
        bot.pvp.attack(enemy.entity);
    }
}