import { system, world, BlockPermutation } from '@minecraft/server';


system.beforeEvents.startup.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:design', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const currentState = block.permutation.getState('block:design');
			let newState = 0;
			if(currentState < 4) {
				newState = currentState + 1
			}
			
			const newPermutation = BlockPermutation.resolve(block.typeId, {
				...block.permutation.getAllStates(),
				'block:design': newState
			});
			block.setPermutation(newPermutation);
			player.playSound("dig.soul_sand");
			const dimension = player.dimension;
			dimension.spawnParticle('minecraft:totem_particle', block.location);
	  }
    });
});
