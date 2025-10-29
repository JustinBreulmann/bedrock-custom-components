import {world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import {Microfon} from "../gameplay/job/moderator/menu"
import {home} from "../gameplay/smartphone/menu/home"
import {paper} from "../gameplay/smartphone/menu/bank"
import {builderMode} from "../gameplay/worldedit/builder/inventory"
import {WorldEdit} from "../gameplay/worldedit/menu"
import { changePermutationBlock, Rotation, color, enchanter, changePermutationEntity } from "../core/debug/stick";
import {changePermutation} from "../core/debug/door"
import {Item} from "../extensions/config"
import { exception } from "../exceptions/error";
import { quicktools, lockables } from "../gameplay/worldedit/quicktools";
import { addMoney } from "../gameplay/money/animation";

import { adminTag } from "../extensions/config";

world.afterEvents.itemUse.subscribe((data) => {
    const { source, itemStack } = data;
    
    // Prüfung, ob itemStack existiert
    if (!itemStack) {
        return;
    }
    
    if (itemStack.typeId === Item["Moderator"] && source.hasTag("Moderator")) {
        Microfon(source);
    } else if (itemStack.typeId === Item["Moderator"]) {
        source.sendMessage(`§l§4Channel§f4 §8>> §r§7Dein Moderatorstatus wurde aufgrund zuvieler Moderatoren widerrufen`);
    } else if (itemStack.typeId === Item["Smartphone"]) {
        home(source);
    } else if (itemStack.typeId === "minecraft:paper") {
        paper(source)
    } else if (itemStack.typeId === "minecraft:tripwire_hook" && itemStack.nameTag !== "§r§f§lSperren" && itemStack.nameTag !== "§r§f§lBearbeiten" && itemStack.nameTag !== "§r§f§lPasswort anzeigen") {
        lockables(source)
    }
     else if (itemStack.typeId === "minecraft:totem_of_undying") {
        if(source.hasTag(adminTag)) {
        builderMode(source)
        }
        else {
    exception('noPermission', source)
    return
        }
    }
    else if (itemStack.typeId === "minecraft:iron_pickaxe") {
        if(source.hasTag(adminTag)) {
            quicktools(source)
            }
            else {
        exception('noPermission', source, "")
        return
            }
    }
    else if (itemStack.typeId === "minecraft:nether_star") {
        if(source.hasTag(adminTag)) {
        //test(source)
       world.sendMessage(JSON.stringify(world.getDynamicProperty("dispatch")))
        }
        else {
    exception('noPermission', source, "")
    return
        }
    }
})

let lastMessageTime = 0;

world.beforeEvents.playerInteractWithBlock.subscribe(async (eventItem) => {
    const { itemStack, source, block } = eventItem;
    
    if (!itemStack) {
        return;
    }
    
    const dyeTypes = [
        "minecraft:red_dye", "minecraft:black_dye", "minecraft:blue_dye", "minecraft:brown_dye", "minecraft:cyan_dye", "minecraft:gray_dye",
        "minecraft:green_dye", "minecraft:light_blue_dye", "minecraft:light_gray_dye", "minecraft:lime_dye", "minecraft:magenta_dye",
        "minecraft:orange_dye", "minecraft:pink_dye", "minecraft:purple_dye", "minecraft:yellow_dye", "minecraft:white_dye" , "minecraft:sponge"
    ];

    if (itemStack.typeId === "block:debug_stick_block") {
        eventItem.cancel = true;
        await desync();
        changePermutationBlock(source, block);
    } 
        else if (itemStack.typeId === "minecraft:iron_axe" && source.hasTag("Feuerwehr")) {
        eventItem.cancel = true;
        await desync();
        changePermutation(source, block);
    }
    else if (itemStack.typeId === "minecraft:wooden_sword") {
        let startPoint = null;
        let endPoint = null;
        let i = 0;
            const blockPos = block.location;
            if (blockPos !== undefined) {
              if (startPoint === null && i === 0) {
                startPoint = blockPos;
        
                const startPoint_x = startPoint.x;
                const startPoint_y = startPoint.y;
                const startPoint_z = startPoint.z;
        
                system.run( () => {
                  source.onScreenDisplay.setActionBar(`§aStartpunkt :§r ${startPoint_x} ${startPoint_y} ${startPoint_z}`);
                  source.sendMessage(`§aStartpunkt :§7 ${startPoint_x} ${startPoint_y} ${startPoint_z}`);
                });
                system.runTimeout( () => {
                  i = 1;
                }, 5);
              }
              else if (endPoint === null && startPoint !== null && i === 1) {
        
                endPoint = blockPos;
        
                const endPoint_x = endPoint.x;
                const endPoint_y = endPoint.y;
                const endPoint_z = endPoint.z;
        
                let relativeCoordinates_x = endPoint_x - startPoint.x;
                let relativeCoordinates_y = endPoint_y - startPoint.y;
                let relativeCoordinates_z = endPoint_z - startPoint.z;
        
                if (relativeCoordinates_x === 0) relativeCoordinates_x = "";
                if (relativeCoordinates_y === 0) relativeCoordinates_y = "";
                if (relativeCoordinates_z === 0) relativeCoordinates_z = "";
        
                system.run( () => {
                  source.onScreenDisplay.setActionBar(`§bRelative Coordinates :§r ~${relativeCoordinates_x} ~${relativeCoordinates_y} ~${relativeCoordinates_z}`);
                  source.sendMessage(`§bEndpunkt : ${endPoint_x} ${endPoint_y} ${endPoint_z}`);
                  source.sendMessage(`§dRelative Koordinaten : ~${relativeCoordinates_x} ~${relativeCoordinates_y} ~${relativeCoordinates_z}`);
                });
                startPoint = null;
                endPoint = null;
                system.runTimeout( () => {
                  i = 0;
                }, 5);
              };

              eventItem.cancel = true;
          };
        }
    else if(itemStack.typeId == "minecraft:stick") {
        await desync ();
        eventItem.cancel = true
        Rotation(source, block)
 }
    else if (dyeTypes.includes(itemStack.typeId)) {
        await desync();
        color(source, block, itemStack);
    }
    else if (itemStack.typeId === "minecraft:wooden_axe") {
        eventItem.cancel = true;
        await desync();

        const currentTime = Date.now();
        if (currentTime - lastMessageTime >= 500) {
            const location = block.location;
            const sourceTags = source.getTags();

            if (sourceTags.some((t) => t.startsWith("pos2")) && sourceTags.some((t) => t.startsWith("pos1"))) {
				source.removeTag(sourceTags.filter((t) => t.startsWith("pos2"))[0]);
				source.removeTag(sourceTags.filter((t) => t.startsWith("pos1"))[0]);
                source.sendMessage(`§5§lWorldEdit §r>> §7Position 1 (x=${location.x}, y=${location.y}, z=${location.z})`);
                source.addTag(`pos1,${location.x}, ${location.y}, ${location.z}`);
                lastMessageTime = currentTime;
            }
            if (sourceTags.some((t) => t.startsWith("pos1")) && !sourceTags.some((t) => t.startsWith("pos2"))) {
				source.sendMessage(`§5§lWorldEdit §r>> §7Position 2 (x=${location.x}, y=${location.y}, z=${location.z})`);
                source.addTag(`pos2,${location.x}, ${location.y}, ${location.z}`);
                lastMessageTime = currentTime;
				WorldEdit(source)
            }
            if (!sourceTags.some((t) => t.startsWith("pos1")) && !sourceTags.some((t) => t.startsWith("pos2"))) {
                source.sendMessage(`§5§lWorldEdit §r>> §7Position 1 (x=${location.x}, y=${location.y}, z=${location.z})`);
                source.addTag(`pos1,${location.x}, ${location.y}, ${location.z}`);
                lastMessageTime = currentTime;
            }
        }
    }
});

async function desync(ticks) {
	for (let i = 0; i < ticks; i++) await null;
	return true;
  }