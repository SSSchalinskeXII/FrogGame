window.onload = function() {

    var countdownTimer;
    var game;
    var timerEvent;
    var sprite;
    var player;
    var lives;
    var deathTime;
    var canMove = true;
    var playerAlive = true;
    var yjumpDistance = 1975;
    var xjumpDistance = 1500;
    
    var obstacle;
    var obstacleSpeed = 50;

    var txt_SecondsLeft;
    var timeleft_seconds;
    var txt_CurrentLivesLeftValue;
    var txt_CurrentLivesLeftDisplay;
    var txt_LivesLeftLabel;

    var txt_CurrentScoreValue;
    var txt_CurrentScoreDisplay;
    var txt_ScoreLabel;
    var txt_TimeLeft;
    var snd_jump;

    var game = new Phaser.Game(720, 462, Phaser.AUTO, 'game',  { preload: preload, create: create, render: render, update: update });


    function preload () {

        game.load.image('img_placeholder', 'level1mockupplaceholder2.png');
        game.load.image('img_frogsprite', 'frog_Sprite/frogBase.png');
        game.load.image('img_nick', 'nick.png');
        game.load.audio('snd_jump','frogjump.wav');
        game.load.spritesheet('frogJump', 'frog_Sprite/frogJumpSprite.png', 32, 32, 2);

    }

    function create () {

        // Game Timer
        //timer = new Phaser.Timer(game, false);
        countdownTimer = game.time.create(false);
        setTimer(countdownTimer, 5);
        countdownTimer.start();

        // Placeholder Background
        game.add.sprite(0,0, 'img_placeholder');

        player = game.add.sprite(350,400, 'img_frogsprite');
        player.frame = 0;

        // Animating the Sprites
        player.animations.add('jump', [0, 1], 2, 2)

        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        // Time Left Text Elements
        txt_TimeLeft = game.add.text(300, 427, "Time:");
        txt_TimeLeft.fill = "#FFFFFF";
        txt_TimeLeft.anchor.set(0,0);
        txt_TimeLeft.font ='Source Code Pro';
        txt_TimeLeft.fontSize ='33px';

        timeleft_seconds = 15;
        txt_SecondsLeft = game.add.text(410, 427, timeleft_seconds);
        txt_SecondsLeft.fill = "#FF0000";
        txt_SecondsLeft.anchor.set(0,0);
        txt_SecondsLeft.font ='Source Code Pro';
        txt_SecondsLeft.fontSize ='33px';
        
        // Score Text Elements
        txt_ScoreLabel = game.add.text(5, 427, "Score:");
        txt_ScoreLabel.fill = "#FFFFFF";
        txt_ScoreLabel.anchor.set(0,0);
        txt_ScoreLabel.font ='Source Code Pro';
        txt_ScoreLabel.fontSize ='33px';

        setCurrentScore(17000);
        changeCurrentScore('add',500);
        txt_CurrentScoreDisplay = game.add.text(130, 427, txt_CurrentScoreValue);
        txt_CurrentScoreDisplay.fill = "#FF0000";
        txt_CurrentScoreDisplay.anchor.set(0,0);
        txt_CurrentScoreDisplay.font ='Source Code Pro';
        txt_CurrentScoreDisplay.fontSize ='33px';

        // Lives Text Elements
        txt_LivesLeftLabel = game.add.text(561, 427, "Lives:");
        txt_LivesLeftLabel.fill = "#FFFFFF";
        txt_LivesLeftLabel.anchor.set(0,0);
        txt_LivesLeftLabel.font ='Source Code Pro';
        txt_LivesLeftLabel.fontSize ='33px';

        setNumberOfLives(3);
        //changeNumberOfLives("add", 1);  // This is just a testing line
        txt_CurrentLivesLeftDisplay = game.add.text(680, 427, txt_CurrentLivesLeftValue);
        txt_CurrentLivesLeftDisplay.fill = "#FF0000";
        txt_CurrentLivesLeftDisplay.anchor.set(0,0);
        txt_CurrentLivesLeftDisplay.font ='Source Code Pro';
        txt_CurrentLivesLeftDisplay.fontSize ='33px';

        // Audio 
        snd_jump = game.add.audio('snd_jump');
        //snd_jump.play();
        
        spawnObstacle(1, 350, 1, 'img_nick');

    }

    function update() { 

        //Movement
        cursors = game.input.keyboard.createCursorKeys();
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.up.isDown){
            //  Move up
            while(canMove){
                player.body.velocity.y = -yjumpDistance;
                canMove = false;
                player.animations.play('jump');
                player.angle = 0;
            }
        } else if (cursors.down.isDown){
            //  Move down
            while(canMove){
                player.body.velocity.y = yjumpDistance;
                canMove = false;
                player.animations.play('jump');
                player.angle = 180;
            }
        } else if (cursors.right.isDown){
            //  Move to the right
            while(canMove){
                player.body.velocity.x = xjumpDistance;
                canMove = false;
                player.animations.play('jump');
                player.angle = 90;
            }
        } else if (cursors.left.isDown){
            //  Move to the left
            while(canMove){
                player.body.velocity.x = -xjumpDistance;
                canMove = false;
                player.animations.play('jump');
                player.angle = 270;
            }
        } else {
            canMove = true;
        }
        
        //Collision Detection
        if (playerAlive) {
            game.physics.arcade.collide(player, obstacle, frogDeath, null, this);
        } else {
            //Respawn Player
            if(game.time.now > deathTime + 1000){
                respawnPlayer();

            }
        }
        //console.log(playerAlive); // - For Testing
        
        //Obstacle Movement
        obstacle.body.velocity.x = obstacleSpeed;
        
        
    }

    function render() {

        updateTimerOSD();
        updateLivesOSD();
        updateScoreOSD();
        displayTimerDebug(countdownTimer, false);


    }


    function setCurrentScore(amount){

        txt_CurrentScoreValue = amount;

    }

    function changeCurrentScore(addOrSubtract, amount){

        if (addOrSubtract == "add"){

            txt_CurrentScoreValue = txt_CurrentScoreValue + amount;

        } else if (addOrSubtract == "subtract") {

            txt_CurrentScoreValue = txt_CurrentScoreValue - amount;
        }        

    }

    function updateScoreOSD() {

        txt_CurrentScoreDisplay.text = txt_CurrentScoreValue;

    }


    function setNumberOfLives(amount) {

        lives = amount;

    }

    function subtractLife() {

        txt_CurrentLivesLeftValue = lives--;

    }

    function updateLivesOSD() {

        txt_CurrentLivesLeftDisplay.text = lives;

    }

    function setTimer(timerObject, durationInSeconds) {

       // timerObject.add(durationInSeconds * 1000, timerEnded, this);
       // timerObject.start();
       countdownTimer.add(durationInSeconds * 1000, timerEnded, this);

    }

    function startTimer(timerObject) {

       // timer.start();

    }

    function timerEnded() {

        frogDeath(player);
        //changeNumberOfLives("subtract",1); // For Testing
        //changeCurrentScore('subtract',1000); // For Testing

    }

    function updateTimerOSD() {

        if (countdownTimer.running) {
            timeleft_seconds = countdownTimer.duration.toFixed(0) / 1000;
            txt_SecondsLeft.text = timeleft_seconds.toFixed(0);
        }
        else {
            txt_SecondsLeft.text = 0;
        }

    }

    function displayTimerDebug(timerObject, enabled) {
        
        if (enabled === true) {

            //console.log('Timer Debug Display enabled');
            game.debug.text("Time until event (timer.duration): " + timerObject.duration, 32, 32);
            game.debug.text("Is Timer Running? (timer.running): " + timerObject.running, 32, 64);
            game.debug.text("For How Long? (timer.seconds): " + timerObject.seconds, 32, 96);      
            game.debug.text("Does it have events? (timer.events): " + timerObject.events, 32, 128);
            game.debug.text("Is it paused? (timer.paused): " + timerObject.paused, 32, 160);
            game.debug.text("(timer.onComplete): " + timerObject.onComplete, 32, 192);
            game.debug.text("(timer.onNextTick): " + timerObject.onNextTick, 32, 224);
            game.debug.text("(timer.elapsed): " + timerObject.elapsed, 32, 256);
            game.debug.text("(timer.expired): " + timerObject.expired, 32, 288);
            game.debug.text("(timer.game): " + timerObject.game, 32, 310);
            game.debug.text("(timer.length): " + timerObject.length, 32, 342);
            game.debug.text("(timer.next): " + timerObject.next, 32, 374);
            game.debug.text("(timer.nextTick): " + timerObject.nextTick, 32, 406);
    
        } else if (enabled == false) {
    
            //console.log('Timer Debug Display disabled');
        }
    
    }


    
    function spawnObstacle(x, y, max, sprite) {
        
        // console.log("Hello"); // - For Testing
        
        for (var i =0; i < max; i++) {
            
            // console.log(i); // - For Testing
            obstacle = game.add.sprite(x, y, sprite);
            game.physics.arcade.enable(obstacle);
            
        }
        
    }
    
    
    function frogDeath(frog) {
        playerAlive = false;
        frog.kill();
        if (lives < 1){
            //TODO: gameOver();
        }
        subtractLife();
        deathTime = game.time.now;
        //TODO: reset timer
    }
    
    function respawnPlayer() {
        player.reset(350,400);
        playerAlive = true;
        setTimer(countdownTimer,5);
        //console.log(canMove); // For testing
    }


};

