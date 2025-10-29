import { system, ItemStack } from '@minecraft/server';

system.beforeEvents.startup.subscribe.subscribe(eventData => {
    eventData.blockComponentRegistry.registerCustomComponent('block:getItem', {
        onPlayerInteract(e) {
            const { player } = e;
            const equipment = player.getComponent('equippable');
			const item = new ItemStack("feuerwehr:fire_extinguisher")
			player.getComponent("inventory")
			inv.setItem(slot, item)
			equippable.setEquitment("Mainhand", item)
		}
	})
})
