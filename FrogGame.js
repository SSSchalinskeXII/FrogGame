window.onload = function() {

    var game = new Phaser.Game(1093, 631, Phaser.AUTO, '', { preload: preload, create: create });

    function preload () {

        game.load.image('img_placeholder', 'pretendgame.png');
        game.load.audio('snd_jump','frogjump.wav');

    }

    function create () {

        // Visuals
        var placeholder = game.add.sprite(game.world.centerX, game.world.centerY, 'img_placeholder');
        placeholder.anchor.setTo(0.5, 0.5);

        // Audio 
        var snd_jump = game.add.audio('snd_jump');
        //snd_jump.play();

    }

    function update() {


    }
};