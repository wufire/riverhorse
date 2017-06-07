
BasicGame.Game = function (game) {

    //	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

var click_counter = 0;
var fish_group;
var border_group;

BasicGame.Game.prototype = {

    create: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        fish_group = this.game.add.group();

        //  We will enable physics for any fish that is created in this group
        fish_group.enableBody = true;

        //  Here we'll create 10 of them randomly positioned
        for (var i = 0; i < 10; i++)
        {
            //  Create a fish inside of the fish_group
            var fish = fish_group.create(
                this.world.width * Math.random(),
                this.world.height * Math.random(),
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
            fish.events.onInputDown.add(this.fish_click_listener, this, fish);
        }

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        text = this.game.add.text(0, 0, '', style);
        text.setTextBounds(0, 0, this.world.width, this.world.height * 0.5)

        this.game.input.onTap.add(this.onTap, this);

        // fish_group.scale.set(configuration.scale_ratio);

        // Border
        // border_group = this.game.add.group();
        // border_group.enableBody = true;
        // for (var i = 0; i < 10; i++) {
        //     for (var j = 0; j < 2; j++) {
        //         var border_tile = border_group.create(
        //             i * 120,
        //             j * (this.world.height - 120),
        //             'fish',
        //             'fishTile_001.png');
        //         border_tile.body.immovable = true;
        //     }
        // }

    },

    update: function () {
        //  Collide the fish_group with itself
        this.physics.arcade.collide(fish_group);

        this.physics.arcade.collide(fish_group, border_group);

    },

    quitGame: function (pointer) {

        //	Here you should destroy anything you no longer need.
        //	Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //	Then let's go back to the main menu.
        this.state.start('MainMenu');

    },

    onTap: function (pointer, doubleTap) {
        var phys = this.physics.arcade;
        fish_group.children.forEach(function(fish) {
            phys.moveToPointer(fish, 50);
        });
        click_counter += 1;
        if (click_counter === 10) {
            click_counter = 0;
            console.log('10 taps');
        }
    },

    fish_click_listener: function (fish) {
        text.text = "You are a fish murderer.";

        fish.frameName = 'fishTile_091.png';
        fish.body.gravity.y = -50;

        fish.events.onInputDown.remove(this.fish_click_listener, this);
        fish.events.onInputDown.add(this.fish_click_revive_listener, this, fish);
    },

    fish_click_revive_listener: function (fish) {
        fish.frameName = 'fishTile_073.png';
        fish.body.gravity.y = 0;
        fish.events.onInputDown.remove(this.fish_click_revive_listener, this);
        fish.events.onInputDown.add(this.fish_click_listener, this, fish);
    }

};
