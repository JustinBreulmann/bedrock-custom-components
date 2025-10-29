import { system, world, BlockPermutation } from '@minecraft/server';

system.beforeEvents.startup.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:color', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            const currentState = block.permutation.getState('block:color');
			let newColor
			const dyes = [
				"minecraft:white_dye", "minecraft:black_dye", "minecraft:blue_dye", "minecraft:brown_dye",
				"minecraft:cyan_dye", "minecraft:gray_dye", "minecraft:green_dye", "minecraft:light_blue_dye",
				"minecraft:lime_dye", "minecraft:magenta_dye", "minecraft:orange_dye", "minecraft:pink_dye",
				"minecraft:purple_dye", "minecraft:red_dye", "minecraft:light_gray_dye", "minecraft:yellow_dye"
			];
			
			if (selectedItem?.typeId === "minecraft:brush" ) {
				if(currentState < 15) {
				newColor = currentState + 1;
				}
				else {
				newColor = 0;
				}
				const newPermutation = BlockPermutation.resolve(block.typeId, {
					...block.permutation.getAllStates(),
					'block:color': newColor
				});
				block.setPermutation(newPermutation);
				player.playSound("dig.soul_sand");
				const dimension = player.dimension;
				dimension.spawnParticle('minecraft:totem_particle', block.location);
			}
			
			if (dyes.includes(selectedItem?.typeId)) {
				newColor = dyes.indexOf(selectedItem.typeId);
		
				if (player.getGameMode() !== "creative") {
					if (selectedItem.amount > 1) {
						selectedItem.amount -= 1;
						equipment.setEquipment('Mainhand', selectedItem);
					} else {
						equipment.setEquipment('Mainhand', undefined); // Clear the slot if only 1 item left
					}
				}
				const newPermutation = BlockPermutation.resolve(block.typeId, {
					...block.permutation.getAllStates(),
					'block:color': newColor
				});
				block.setPermutation(newPermutation);
				player.playSound("dig.soul_sand");
				const dimension = player.dimension;
				dimension.spawnParticle('minecraft:totem_particle', block.location);
			}

			
	  }
    });
});
