window.onload = function() {

    var game = new Phaser.Game(719, 461, Phaser.AUTO, 'game',  { preload: preload, create: create, render: render, update: update });
    var timer;
    var timerHasRepeatedThisManyTimes = 0;

    var txt_SecondsLeft;
    var timeleft_seconds;
    var player1sprite;

    function preload () {

        game.load.image('img_placeholder', 'level1mockupplaceholder.png');
        game.load.image('img_frogsprite', 'frogsprite.png');
        game.load.audio('snd_jump','frogjump.wav');

    }

    function create () {

        // Game Timer
        timer = game.time.create();
        //timer.duration = 30000;
        timer.loop(30000,timerFinished, this);
        timer.start();

        // Placeholder Background
        var placeholder = game.add.sprite(game.world.centerX, game.world.centerY, 'img_placeholder');
        placeholder.anchor.setTo(0.5, 0.5);

        player1sprite = game.add.sprite(250,390, 'img_frogsprite');

        // Time Left Text Elements
        var txt_TimeLeft = game.add.text(250, 425, "Time Left:")
        txt_TimeLeft.fill = "#FFFFFF";
        txt_TimeLeft.anchor.set(0,0);
        txt_TimeLeft.font ='Source Code Pro';
        txt_TimeLeft.fontSize ='33px';

        timeleft_seconds = 15;
        txt_SecondsLeft = game.add.text(460, 425, timeleft_seconds)
        txt_SecondsLeft.fill = "#FF0000";
        txt_SecondsLeft.anchor.set(0,0);
        txt_SecondsLeft.font ='Source Code Pro';
        txt_SecondsLeft.fontSize ='33px';
        
        // Score Text Elements
        var txt_ScoreLabel = game.add.text(15, 10, "Score:")
        txt_ScoreLabel.fill = "#FFFFFF";
        txt_ScoreLabel.anchor.set(0,0);
        txt_ScoreLabel.font ='Source Code Pro';
        txt_ScoreLabel.fontSize ='33px';

        var txt_CurrentScoreValue = 17000;
        var txt_CurrentScoreDisplay = game.add.text(140, 10, txt_CurrentScoreValue)
        txt_CurrentScoreDisplay.fill = "#FF0000";
        txt_CurrentScoreDisplay.anchor.set(0,0);
        txt_CurrentScoreDisplay.font ='Source Code Pro';
        txt_CurrentScoreDisplay.fontSize ='33px';

        // Lives Text Elements
        var txt_LivesLeftLabel = game.add.text(531, 5, "Lives:")
        txt_LivesLeftLabel.fill = "#FFFFFF";
        txt_LivesLeftLabel.anchor.set(0,0);
        txt_LivesLeftLabel.font ='Source Code Pro';
        txt_LivesLeftLabel.fontSize ='33px';

        var txt_CurrentLivesLeftValue = 8;
        var txt_CurrentLivesLeftDisplay = game.add.text(650, 5, txt_CurrentLivesLeftValue)
        txt_CurrentLivesLeftDisplay.fill = "#FF0000";
        txt_CurrentLivesLeftDisplay.anchor.set(0,0);
        txt_CurrentLivesLeftDisplay.font ='Source Code Pro';
        txt_CurrentLivesLeftDisplay.fontSize ='33px';

        // Audio 
        var snd_jump = game.add.audio('snd_jump');
        //snd_jump.play();

    }

    function update() {
        
    }

    function timerFinished() {
        timer.stop();
    }

    function render() {

        if (timer.running) {
            timeleft_seconds = timer.duration.toFixed(0) / 1000
            txt_SecondsLeft.text = timeleft_seconds.toFixed(0);
        }
        else {
            txt_SecondsLeft.text = 0;
        }

    }
};