import { system, world, BlockPermutation } from '@minecraft/server';

system.beforeEvents.startup.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:combination', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            const currentState = block.permutation.getState('block:combination');
			let newColor = 0;
			
			if (selectedItem?.typeId === "block:utensils" && currentState < 3) {
				newColor = currentState + 1;
			}
					
			const newPermutation = BlockPermutation.resolve(block.typeId, {
				...block.permutation.getAllStates(),
				'block:combination': newColor
			});
			block.setPermutation(newPermutation);
			player.playSound("dig.soul_sand");
			const dimension = player.dimension;
			dimension.spawnParticle('minecraft:totem_particle', block.location);
	  }
    });
});
