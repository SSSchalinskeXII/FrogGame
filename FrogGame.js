window.onload = function() {

    var game = new Phaser.Game(720, 462, Phaser.AUTO, 'game',  { preload: preload, create: create, render: render, update: update });
    var timer;
    var sprite;
    var player;
    var canMove = true;
    var yjumpDistance = 1975;
    var xjumpDistance = 1500;
    
    var obstacle;
    var obstacleSpeed = 50;

    var txt_SecondsLeft;
    var timeleft_seconds;

    function preload () {

        game.load.image('img_placeholder', 'level1mockupplaceholder2.png');
        game.load.image('img_frogsprite', 'frogsprite.png');
        game.load.image('img_nick', 'nick.png');
        game.load.audio('snd_jump','frogjump.wav');

    }

    function create () {

        // Game Timer
        timer = game.time.create();
        initializeTimer(timer, 5, 500);
        startTimer(timer);

        // Placeholder Background
        game.add.sprite(0,0, 'img_placeholder');

        player = game.add.sprite(350,400, 'img_frogsprite');

        game.physics.arcade.enable(player);

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
        
        spawnObstacle(1, 350, 1, 'img_nick');

    }

    function update() { 

        cursors = game.input.keyboard.createCursorKeys();
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.up.isDown){
            //  Move up
            while(canMove){
                player.body.velocity.y = -yjumpDistance;
                canMove = false;
            }
        } else if (cursors.down.isDown){
            //  Move down
            while(canMove){
                player.body.velocity.y = yjumpDistance;
                canMove = false;
            }
        } else if (cursors.right.isDown){
            //  Move to the right
            while(canMove){
                player.body.velocity.x = xjumpDistance;
                canMove = false;
            }
        } else if (cursors.left.isDown){
            //  Move to the left
            while(canMove){
                player.body.velocity.x = -xjumpDistance;
                canMove = false;
            }
        } else {
            canMove = true;
        }
        
        obstacle.body.velocity.x = obstacleSpeed;
        
    }

    function render() {

        updateTimerOSD();

    }

    function initializeTimer(timerObject, durationInSeconds) {

        timerObject.loop(durationInSeconds * 1000,stopTimer, this);

    }

    function startTimer(timerObject) {

        timer.start();

    }

    function stopTimer() {

        timer.stop();

    }

    function updateTimerOSD() {

        if (timer.running) {
            timeleft_seconds = timer.duration.toFixed(0) / 1000;
            txt_SecondsLeft.text = timeleft_seconds.toFixed(0);
        }
        else {
            txt_SecondsLeft.text = 0;
        }

    }
    
    function spawnObstacle(x, y, max, sprite) {
        
        console.log("Hello");
        
        for (var i =0; i < max; i++) {
            
            console.log(i);
            obstacle = game.add.sprite(x, y, sprite);
            game.physics.arcade.enable(obstacle);
            
        }
        
    }


};