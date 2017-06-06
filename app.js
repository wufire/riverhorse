var configuration = {
'canvas_width_max' : 2048,
'canvas_width' : 1000,
'canvas_height_max' : 2048,
'canvas_height' : 650,
'scale_ratio' : 1,
'aspect_ratio' : 1,
};

configuration.canvas_width = window.screen.availWidth * window.devicePixelRatio;
configuration.canvas_height = window.screen.availHeight * window.devicePixelRatio;
configuration.aspect_ratio = configuration.canvas_width / configuration.canvas_height;
if (configuration.aspect_ratio < 1) configuration.scale_ratio = configuration.canvas_height / configuration.canvas_height_max;
else configuration.scale_ratio = configuration.canvas_width / configuration.canvas_width_max;

var game = new Phaser.Game(configuration.canvas_width, configuration.canvas_height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

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

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    text = game.add.text(0, 0, '', style);
    text.setTextBounds(0, 0, game.world.width, game.world.height * 0.2)

    game.input.onTap.add(onTap, this);

    // Canvas Scaling
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.refresh();

    fish_group.scale.set(configuration.scale_ratio);
}

function update() {
    //  Collide the fish_group with itself
    game.physics.arcade.collide(fish_group);
}

function onTap(pointer, doubleTap) {
    fish_group.children.forEach(function(fish) {
        game.physics.arcade.moveToPointer(fish, 20);
    });
    counter += 1;
    if (counter === 10) {
        counter = 0;
        console.log('10 taps');
    }
}

function fish_click_listener(fish) {
    text.text = "You are a fish murderer.";

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
