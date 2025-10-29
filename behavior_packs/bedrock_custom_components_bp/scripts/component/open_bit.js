import { system, BlockPermutation ,ItemStack} from '@minecraft/server';

system.beforeEvents.startup.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:open_bit', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const currentState = block.permutation.getState('block:open_bit');
			const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand')
			
			if(player.isSneaking) {
			const newPermutation = BlockPermutation.resolve(block.typeId, {
				...block.permutation.getAllStates(),
				'block:open_bit': !currentState
			});
			block.setPermutation(newPermutation);
			player.playSound("land.sand")
			}

			if(block.type.id === "block:christmas_tree" || block.type.id === "block:christmas_tree_white" && currentState === false) {

				// player.stopSound()

				player.runCommandAsync('stopsound @s custom.music')
				player.playSound("custom.music",{x: block.location.x, y: block.location.y, z: block.location.z})
			} 

			if(block.type.id === "block:toaster" && selectedItem?.typeId == "minecraft:bread" && currentState === false) {
				if (player.getGameMode() !== "creative") {
					if (selectedItem.amount > 1) {
						selectedItem.amount -= 1;
						equipment.setEquipment('Mainhand', selectedItem);
					} else {
						equipment.setEquipment('Mainhand', undefined); 
					}
				}

				const newPermutation = BlockPermutation.resolve(block.typeId, {
					...block.permutation.getAllStates(),
					'block:open_bit': true
				});
				block.setPermutation(newPermutation);

				system.runTimeout(() =>{
					const newPermutation = BlockPermutation.resolve(block.typeId, {
						...block.permutation.getAllStates(),
						'block:open_bit': false
					});
					block.setPermutation(newPermutation);
					const itemStack = new ItemStack('minecraft:bread');
					const overworld = world.getDimension('overworld');
					overworld.spawnItem(itemStack, block.location);
				},30) 

			}
	  }
    });
});
