export class Player {
    constructor(scene, x, y) {
        scene.anims.create({
            key: 'player-still',
            frames: [ {  key: 'characters', frame: 7 } ],
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'player-down',
            frames: scene.anims.generateFrameNumbers('characters', {start: 6, end: 8}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'player-left',
            frames: scene.anims.generateFrameNumbers('characters', {start: 18, end: 20}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'player-right',
            frames: scene.anims.generateFrameNumbers('characters', {start: 30, end: 32}),
            frameRate: 10,
            repeat: -1,
        })
        scene.anims.create({
            key: 'player-up',
            frames: scene.anims.generateFrameNumbers('characters', {start: 42, end: 44}),
            frameRate: 10,
            repeat: -1,
        })

        this.scene = scene;
        this.player = scene.physics.add.sprite(x, y, 'characters')
        this.player.setCollideWorldBounds(true)

        // Setup animation
        this.animation_name = 'player-still'
        this.player.anims.play(this.animation_name)
        this.cursors = scene.input.keyboard.createCursorKeys()

        // Picked up item
        this.pickedUp = null;
        this.lastSpaceDown = null;
    }

    getObject() {
        return this.player
    }

    update(dynamicLayer) {
        let animation_name = 'player-still'

        this.player.setVelocity(0)
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200)
            animation_name = 'player-left'
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200)
            animation_name = 'player-right'
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
            animation_name = 'player-up'
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
            animation_name = 'player-down'
        }

        if (this.cursors.space.isDown &&
            this.cursors.space.timeDown != this.lastSpaceDown) { // simulate ondown
            this.lastSpaceDown = this.cursors.space.timeDown;
            if (this.pickedUp == null) {
                let pickupSides = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]
                let validPickups = []
                for (let i = 0; i < pickupSides.length; i++)
                {
                    let x = dynamicLayer.worldToTileX(this.player.x)
                    let y = dynamicLayer.worldToTileY(this.player.y)
                    let tile = dynamicLayer.getTileAt(x, y)
                    if (!tile) {
                        continue
                    }
                    validPickups.push([x, y])
                }

                if (validPickups.length > 0)
                {
                    // Pickup item
                    const [tileX, tileY] = Phaser.Math.RND.pick(validPickups)
                    let tile = dynamicLayer.removeTileAt(tileX, tileY)
                    this.pickedUp = tile.index
                    console.log("Picked up item", this.pickedUp)
                }
            }
        }

        this.player.anims.play(animation_name, true)
        this.animation_name = animation_name
    }
}
