import { system, world } from "@minecraft/server";


system.beforeEvents.startup.subscribe(eventData => {
    eventData.itemComponentRegistry.registerCustomComponent("item:fire_extinguisher", {
		onUse(e) {
			const source = e.source;
			const item = e.itemStack;
			world.sendMessage("It works?")
			if (item.typeId == 'feuerwehr:fire_extinguisher' && item.getComponent("durability") && typeof durability.damage === "number" && durability.damage > 0) {
			shootProjectile(source, 'feuerwehr:fire_extinguisher_e', 1);
			source.playSound("fire_extinguisher")
		   }
		   else return
	    }
	});
})

function shootProjectile(entity, projectile, power) {
    const headLoc = entity.getHeadLocation();
    const viewVector = entity.getViewDirection();
    const direction = { x: headLoc.x + viewVector.x, y: headLoc.y + viewVector.y, z: headLoc.z + viewVector.z };
    const vel = { x: viewVector.x * power, y: viewVector.y * power, z: viewVector.z * power };
    const projectileEntity = entity.dimension.spawnEntity(projectile, direction).getComponent('projectile');
    projectileEntity.owner = entity;
    projectileEntity.shoot(vel);
};