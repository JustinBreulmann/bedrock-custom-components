import { world,  system, BlockPermutation,ItemStack } from '@minecraft/server';

system.beforeEvents.startup.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:food', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
			const currentState = block.permutation.getState('block:food');
			let newColor = 0;
			const dyes = [
				"minecraft:air","minecraft:cooked_beef", "cooked_porkchop", "minecraft:cooked_chicken", "minecraft:cooked_mutton",
				"minecraft:cooked_rabbit", "minecraft:cooked_cod", "minecraft:cooked_salmon"
			];
			if (currentState >= 0 && currentState < dyes.length) {			
			const itemStack = new ItemStack(dyes[currentState]);
			const overworld = world.getDimension('overworld');
			overworld.spawnItem(itemStack, block.location);
			}

			if (dyes.includes(selectedItem?.typeId)) {
				newColor = dyes.indexOf(selectedItem.typeId);
		
				if (player.getGameMode() !== "creative") {
					if (selectedItem.amount > 1) {
						selectedItem.amount -= 1;
						equipment.setEquipment('Mainhand', selectedItem);
					} else {
						equipment.setEquipment('Mainhand', undefined); 
					}
				}
			}
			
			const newPermutation = BlockPermutation.resolve(block.typeId, {
				...block.permutation.getAllStates(),
				'block:food': newColor
			});
			block.setPermutation(newPermutation);
			player.playSound("liquid_lavapop")
	  }
    });
});
