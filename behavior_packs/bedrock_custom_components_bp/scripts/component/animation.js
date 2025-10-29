import { system, world, BlockPermutation, ItemStack,  } from '@minecraft/server';

system.beforeEvents.startup.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:animation', {
        onPlayerInteract(e) {
            const { block, player } = e;
            const currentState = block.permutation.getState('block:animation');
            animation(block, player, currentState);
        }
    });
});

function animation(block, player, currentState) {
    if (currentState < 8) {
        const newState = currentState + 1;

        const newPermutation = BlockPermutation.resolve(block.typeId, {
            ...block.permutation.getAllStates(),
            'block:animation': newState
        });

        block.setPermutation(newPermutation);
        player.playSound("playsound random.pop");

        system.runTimeout(() => {
            animation(block, player, newState);
        }, 5);
    } else {
        const itemStack = new ItemStack('minecraft:paper');
        const overworld = world.getDimension('overworld');
        overworld.spawnItem(itemStack, block.location);

        const newPermutation = BlockPermutation.resolve(block.typeId, {
            ...block.permutation.getAllStates(),
            'block:animation': 0
        });

        block.setPermutation(newPermutation);
    }
}
