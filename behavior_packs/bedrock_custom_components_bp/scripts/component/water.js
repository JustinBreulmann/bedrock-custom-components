import { system, BlockPermutation } from '@minecraft/server';

system.beforeEvents.startup.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:water', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            const currentState = block.permutation.getState('block:water');
			
			if (selectedItem?.typeId === "minecraft:brush") return
			
			const newPermutation = BlockPermutation.resolve(block.typeId, {
				...block.permutation.getAllStates(),
				'block:water': !currentState
			});
			block.setPermutation(newPermutation);
			if(currentState === false)
				player.playSound("bucket.fill_water");
			if(currentState === true)
				player.playSound("bucket.empty_water");	
			const dimension = player.dimension;
			dimension.spawnParticle('minecraft:water', block.location);
			
			while(block.type.id === "block:hydrant" && currentState == true) {
				block.spawnParticle('hydrant:water', {x:block.location.x, y:block.location.y +0.5, z:block.location.z})
				block.playSound("ambient.weather.rain")

		}
	  }
    });
});
