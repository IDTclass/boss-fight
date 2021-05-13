enum ActionKind {
    RunningLeft,
    RunningRight,
    Idle,
    IdleLeft,
    IdleRight,
    JumpingLeft,
    JumpingRight,
    CrouchLeft,
    CrouchRight,
    Flying,
    Walking,
    Jumping
}
namespace SpriteKind {
    export const Bumper = SpriteKind.create()
    export const Goal = SpriteKind.create()
    export const Coin = SpriteKind.create()
    export const Flier = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bumper, function (sprite, otherSprite) {
    if (sprite.vy > 0 && !(sprite.isHittingTile(CollisionDirection.Bottom)) || sprite.y < otherSprite.top) {
        otherSprite.destroy(effects.ashes, 250)
        otherSprite.vy = -50
        sprite.vy = -2 * pixelsToMeters
        music.powerUp.play()
        info.changeScoreBy(1)
    } else {
        info.changeLifeBy(-1)
        sprite.say("Ouch!", invincibilityPeriod)
        music.powerDown.play()
    }
    pause(invincibilityPeriod)
})
function initializeAnimations () {
    initializeHeroAnimations()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    attemptJump()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    otherSprite.destroy(effects.trail, 250)
    otherSprite.y += -3
    info.changeScoreBy(3)
    music.baDing.play()
})
function attemptJump () {
    // else if: either fell off a ledge, or double jumping
    if (hero.isHittingTile(CollisionDirection.Bottom)) {
        hero.vy = -4 * pixelsToMeters
    } else if (canDoubleJump) {
        doubleJumpSpeed = -3 * pixelsToMeters
        // Good double jump
        if (hero.vy >= -40) {
            doubleJumpSpeed = -4.5 * pixelsToMeters
            hero.startEffect(effects.trail, 500)
            scene.cameraShake(2, 250)
        }
        hero.vy = doubleJumpSpeed
        canDoubleJump = false
    }
}
function setLevelTileMap (level: number) {
    clearGame()
    if (level == 0) {
        tiles.setTilemap(tilemap`level5`)
    } else if (level == 1) {
        tiles.setTilemap(tilemap`level`)
    } else if (level == 2) {
        tiles.setTilemap(tilemap`level3`)
    }
    initializeLevel(level)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    attemptJump()
})
function clearGame () {
    for (let value of sprites.allOfKind(SpriteKind.Bumper)) {
        value.destroy()
    }
    for (let value2 of sprites.allOfKind(SpriteKind.Coin)) {
        value2.destroy()
    }
    for (let value3 of sprites.allOfKind(SpriteKind.Goal)) {
        value3.destroy()
    }
    for (let value4 of sprites.allOfKind(SpriteKind.Flier)) {
        value4.destroy()
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile1`, function (sprite, location) {
    info.changeLifeBy(1)
    currentLevel += 1
    if (hasNextLevel()) {
        game.splash("Next level unlocked!")
        setLevelTileMap(currentLevel)
    } else {
        game.over(true, effects.confetti)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Flier, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    sprite.say("Ow!", invincibilityPeriod * 1.5)
    music.powerDown.play()
    pause(invincibilityPeriod * 1.5)
})
function createEnemies () {
    // enemy that moves back and forth
    for (let value5 of tiles.getTilesByType(img`
        . . . . . . . . . . . . . . . . 
        . . . . c c c c . . . . . . . . 
        . . c c 5 5 5 5 c c . . . . . . 
        . c 5 5 5 5 f f 5 5 c . . . . . 
        c 5 5 5 5 f 1 2 5 5 5 c . . . . 
        c 5 5 5 5 5 2 2 5 5 5 5 c . . . 
        c 5 5 5 5 5 5 5 5 5 5 5 c . . . 
        c c b b 1 b 5 5 5 5 5 5 d c . . 
        c 5 3 3 3 5 5 5 5 5 d d d c . . 
        . b 5 5 5 5 5 5 5 5 d d d c . . 
        . . c b b c 5 5 b d d d d c c . 
        . c b b c 5 5 b b d d d d c d c 
        . c c c c c c d d d d d d d d c 
        . . . c c c c d 5 5 b d d d c . 
        . . c c c c c b 5 5 b c c c . . 
        . . c b b b c d 5 5 b c . . . . 
        `)) {
        bumper = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . c c c c . . . . . . . . 
            . . c c 5 5 5 5 c c . . . . . . 
            . c 5 5 5 5 f f 5 5 c . . . . . 
            c 5 5 5 5 f 1 2 5 5 5 c . . . . 
            c 5 5 5 5 5 2 2 5 5 5 5 c . . . 
            c 5 5 5 5 5 5 5 5 5 5 5 c . . . 
            c c b b 1 b 5 5 5 5 5 5 d c . . 
            c 5 3 3 3 5 5 5 5 5 d d d c . . 
            . b 5 5 5 5 5 5 5 5 d d d c . . 
            . . c b b c 5 5 b d d d d c c . 
            . c b b c 5 5 b b d d d d c d c 
            . c c c c c c d d d d d d d d c 
            . . . c c c c d 5 5 b d d d c . 
            . . c c c c c b 5 5 b c c c . . 
            . . c b b b c d 5 5 b c . . . . 
            `, SpriteKind.Bumper)
        tiles.placeOnTile(bumper, value5)
        tiles.setTileAt(value5, assets.tile`tile0`)
        bumper.ay = gravity
        if (Math.percentChance(50)) {
            bumper.vx = Math.randomRange(30, 60)
        } else {
            bumper.vx = Math.randomRange(-60, -30)
        }
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(hero.isHittingTile(CollisionDirection.Bottom))) {
        hero.vy += 80
    }
})
function showInstruction (text: string) {
    game.showLongText(text, DialogLayout.Bottom)
    music.baDing.play()
    info.changeScoreBy(1)
}
function initializeHeroAnimations () {
	
}
function createPlayer (player2: Sprite) {
    player2.ay = gravity
    scene.cameraFollowSprite(player2)
    controller.moveSprite(player2, 100, 0)
    player2.z = 5
    info.setLife(1)
    info.setScore(0)
}
function initializeLevel (level: number) {
    effects.clouds.startScreenEffect()
    playerStartLocation = tiles.getTilesByType(img`
        . . . . . . . f f f f f . . . . 
        . . . . . . f e e e e e f . . . 
        . . . . . f e e e d d d d f . . 
        . . . . f f e e d f d d f d c . 
        . . . f d d e e d f d d f d c . 
        . . . c d b e e d d d d e e d c 
        f f . c d b e e d d c d d d d c 
        f e f . c f e e d d d c c c c c 
        f e f . . f f e e d d d d d f . 
        f e f . f e e e e f f f f f . . 
        f e f f e e e e e e e f . . . . 
        . f f e e e e f e f f e f . . . 
        . . f e e e e f e f f e f . . . 
        . . . f e f f b d f b d f . . . 
        . . . f d b b d d c d d f . . . 
        . . . f f f f f f f f f . . . . 
        `)[0]
    tiles.placeOnTile(hero, playerStartLocation)
    tiles.setTileAt(playerStartLocation, assets.tile`tile0`)
    createEnemies()
}
function hasNextLevel () {
    return currentLevel != levelCount
}
let heroFacingLeft = false
let playerStartLocation: tiles.Location = null
let bumper: Sprite = null
let doubleJumpSpeed = 0
let canDoubleJump = false
let currentLevel = 0
let levelCount = 0
let gravity = 0
let pixelsToMeters = 0
let invincibilityPeriod = 0
let hero: Sprite = null
hero = sprites.create(img`
    . . . . . . . f f f f f . . . . 
    . . . . . . f e e e e e f . . . 
    . . . . . f e e e d d d d f . . 
    . . . . f f e e d f d d f d c . 
    . . . f d d e e d f d d f d c . 
    . . . c d b e e d d d d e e d c 
    f f . c d b e e d d c d d d d c 
    f e f . c f e e d d d c c c c c 
    f e f . . f f e e d d d d d f . 
    f e f . f e e e e f f f f f . . 
    f e f f e e e e e e e f . . . . 
    . f f e e e e f e f f e f . . . 
    . . f e e e e f e f f e f . . . 
    . . . f e f f b d f b d f . . . 
    . . . f d b b d d c d d f . . . 
    . . . f f f f f f f f f . . . . 
    `, SpriteKind.Player)
// how long to pause between each contact with a
// single enemy
invincibilityPeriod = 600
pixelsToMeters = 30
gravity = 9.81 * pixelsToMeters
scene.setBackgroundColor(9)
initializeAnimations()
createPlayer(hero)
levelCount = 8
currentLevel = 0
setLevelTileMap(currentLevel)
let statusbar = statusbars.create(20, 4, StatusBarKind.Health)
statusbar.attachToSprite(hero)
let myMinimap = minimap.getImage(minimap.minimap())
// set up hero animations
game.onUpdate(function () {
    if (hero.vx < 0) {
        heroFacingLeft = true
    } else if (hero.vx > 0) {
        heroFacingLeft = false
    }
    if (hero.isHittingTile(CollisionDirection.Top)) {
        hero.vy = 0
    }
    if (controller.down.isPressed()) {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.CrouchLeft)
        } else {
            animation.setAction(hero, ActionKind.CrouchRight)
        }
    } else if (hero.vy < 20 && !(hero.isHittingTile(CollisionDirection.Bottom))) {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.JumpingLeft)
        } else {
            animation.setAction(hero, ActionKind.JumpingRight)
        }
    } else if (hero.vx < 0) {
        animation.setAction(hero, ActionKind.RunningLeft)
    } else if (hero.vx > 0) {
        animation.setAction(hero, ActionKind.RunningRight)
    } else {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.IdleLeft)
        } else {
            animation.setAction(hero, ActionKind.IdleRight)
        }
    }
})
// Flier movement
game.onUpdate(function () {
    for (let value8 of sprites.allOfKind(SpriteKind.Flier)) {
        if (Math.abs(value8.x - hero.x) < 60) {
            if (value8.x - hero.x < -5) {
                value8.vx = 25
            } else if (value8.x - hero.x > 5) {
                value8.vx = -25
            }
            if (value8.y - hero.y < -5) {
                value8.vy = 25
            } else if (value8.y - hero.y > 5) {
                value8.vy = -25
            }
            animation.setAction(value8, ActionKind.Flying)
        } else {
            value8.vy = -20
            value8.vx = 0
            animation.setAction(value8, ActionKind.Idle)
        }
    }
})
// Reset double jump when standing on wall
game.onUpdate(function () {
    if (hero.isHittingTile(CollisionDirection.Bottom)) {
        canDoubleJump = true
    }
})
// bumper movement
game.onUpdate(function () {
    for (let value9 of sprites.allOfKind(SpriteKind.Bumper)) {
        if (value9.isHittingTile(CollisionDirection.Left)) {
            value9.vx = Math.randomRange(30, 60)
        } else if (value9.isHittingTile(CollisionDirection.Right)) {
            value9.vx = Math.randomRange(-60, -30)
        }
    }
})
