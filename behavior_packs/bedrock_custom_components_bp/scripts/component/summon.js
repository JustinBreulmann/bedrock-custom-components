import { system } from '@minecraft/server';

system.beforeEvents.startup.subscribe.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:knot', {
        onPlace(e) {
            const { block } = e;
            if (block && block.dimension) {
                const dimension = block.dimension;
                dimension.spawnEntity("exp:knot_entity", [block.location.x, block.location.y - 1.5, block.location.z]);
                const blockLoc = block.location;
                dimension.getBlock(blockLoc).setType("minecraft:air");
            }
        }
    });
});
