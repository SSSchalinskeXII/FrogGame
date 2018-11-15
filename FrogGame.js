window.onload = function() {

    var game = new Phaser.Game(720, 462, Phaser.AUTO, 'game',  { preload: preload, create: create, render: render, update: update });
    var timer;
    var sprite;
    var player;
    var canMove = true;
    var yjumpDistance = 1975;
    var xjumpDistance = 1500;
    
    var obstacle;

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
        initializeTimer(timer, 5);
        startTimer(timer);

        // Placeholder Background
        game.add.sprite(0,0, 'img_placeholder');

        player = game.add.sprite(350,400, 'img_frogsprite');

        game.physics.arcade.enable(player);
        
        obstacle = game.add.sprite(1, 350, 'img_nick');

        // Time Left Text Elements
        var txt_TimeLeft = game.add.text(300, 427, "Time:")
        txt_TimeLeft.fill = "#FFFFFF";
        txt_TimeLeft.anchor.set(0,0);
        txt_TimeLeft.font ='Source Code Pro';
        txt_TimeLeft.fontSize ='33px';

        timeleft_seconds = 15;
        txt_SecondsLeft = game.add.text(410, 427, timeleft_seconds)
        txt_SecondsLeft.fill = "#FF0000";
        txt_SecondsLeft.anchor.set(0,0);
        txt_SecondsLeft.font ='Source Code Pro';
        txt_SecondsLeft.fontSize ='33px';
        
        // Score Text Elements
        var txt_ScoreLabel = game.add.text(5, 427, "Score:")
        txt_ScoreLabel.fill = "#FFFFFF";
        txt_ScoreLabel.anchor.set(0,0);
        txt_ScoreLabel.font ='Source Code Pro';
        txt_ScoreLabel.fontSize ='33px';

        var txt_CurrentScoreValue = 17000;
        var txt_CurrentScoreDisplay = game.add.text(130, 427, txt_CurrentScoreValue)
        txt_CurrentScoreDisplay.fill = "#FF0000";
        txt_CurrentScoreDisplay.anchor.set(0,0);
        txt_CurrentScoreDisplay.font ='Source Code Pro';
        txt_CurrentScoreDisplay.fontSize ='33px';

        // Lives Text Elements
        var txt_LivesLeftLabel = game.add.text(561, 427, "Lives:")
        txt_LivesLeftLabel.fill = "#FFFFFF";
        txt_LivesLeftLabel.anchor.set(0,0);
        txt_LivesLeftLabel.font ='Source Code Pro';
        txt_LivesLeftLabel.fontSize ='33px';

        var txt_CurrentLivesLeftValue = 8;
        var txt_CurrentLivesLeftDisplay = game.add.text(680, 427, txt_CurrentLivesLeftValue)
        txt_CurrentLivesLeftDisplay.fill = "#FF0000";
        txt_CurrentLivesLeftDisplay.anchor.set(0,0);
        txt_CurrentLivesLeftDisplay.font ='Source Code Pro';
        txt_CurrentLivesLeftDisplay.fontSize ='33px';

        // Audio 
        var snd_jump = game.add.audio('snd_jump');
        //snd_jump.play();

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
        
        spawnObstacle();
        
    }

    function render() {

        updateTimerOSD();

    }

    function setNumberOfLives(amount) {

        txt_CurrentLivesLeftValue = amount;

    }

    function changeNumberOfLives(addOrSubtract, amount) {

        if (addOrSubtract == "add"){

            txt_CurrentLivesLeftValue = txt_CurrentLivesLeftValue + amount;

        } else if (addOrSubtract == "subtract") {

            txt_CurrentLivesLeftValue = txt_CurrentLivesLeftValue - amount;

        }

    }

    function initializeTimer(timerObject, durationInSeconds) {

        timerObject.loop(durationInSeconds * 1000,stopTimer, this);

    }

    function startTimer(timerObject) {

        timer.start();

    }

    function stopTimer() {

        timer.stop();
        changeNumberOfLives("add", 10);
        console.log(txt_CurrentLivesLeftValue);

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
    
    function spawnObstacle() {
        
        var obstacleCount = 0;
        var obstacleX = 1;
        
        if (obstacleCount < 5) {
            
            obstacle = game.add.sprite(obstacleX, 350, 'img_nick');
            obstacleCount += 1;
            obstacleX += 10;
            
        }
        
    }


};