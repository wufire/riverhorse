var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var fish_group;

var text;
var counter = 0;

function preload() {
    game.load.atlasXML('fish', 'assets/fishSpritesheet@2.png', 'assets/fishSpritesheet@2.xml')
}

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    fish_group = game.add.group();

    //  We will enable physics for any fish that is created in this group
    fish_group.enableBody = true;

    //  Here we'll create 10 of them randomly positioned
    for (var i = 0; i < 10; i++)
    {
        //  Create a fish inside of the fish_group
        var fish = fish_group.create(
            game.world.width * Math.random(),
            game.world.height * Math.random(),
            'fish',
            'fishTile_073.png');

        //  Let gravity do its thing
        fish.body.gravity.y = Math.random() - 0.5;
        fish.body.gravity.x = Math.random() - 0.5;

        //  This just gives each fish a slightly random bounce value
        fish.body.bounce.y = 0 + Math.random() * 0.2;
        fish.body.bounce.x = 0 + Math.random() * 0.2;

        fish.body.collideWorldBounds = true;

        fish.inputEnabled = true;
        fish.events.onInputDown.add(fish_click_listener, this, fish);
    }

    text = game.add.text(game.world.height / 2, 16, '', { fill: '#ffffff' });

    //fishTile_091.png
}

function update() {
    //  Collide the fish_group with itself
    game.physics.arcade.collide(fish_group);

    if (game.input.mousePointer.isDown)
    {
        fish_group.children.forEach(function(fish) {
            game.physics.arcade.moveToPointer(fish, 20);
        });
    }

}

function fish_click_listener(fish) {
    counter += 1;
    text.text = "You killed " + counter + " fish!";
    fish.frameName = 'fishTile_091.png';
    fish.body.gravity.y = -50;

    fish.events.onInputDown.remove(fish_click_listener, this);
    fish.events.onInputDown.add(fish_click_revive_listener, this, fish);
}

function fish_click_revive_listener(fish) {
    fish.frameName = 'fishTile_073.png';
    fish.body.gravity.y = 0;
    fish.events.onInputDown.remove(fish_click_revive_listener, this);
    fish.events.onInputDown.add(fish_click_listener, this, fish);
}
