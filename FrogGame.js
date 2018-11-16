window.onload = function() {

    var game = new Phaser.Game(720, 462, Phaser.AUTO, 'game',  { preload: preload, create: create, render: render, update: update });
    var timer;
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

    function initializeTimer(timerObject, durationInSeconds) {

        timerObject.loop(durationInSeconds * 1000,stopTimer, this);

    }

    function startTimer(timerObject) {

        timer.start();

    }

    function stopTimer() {

        timer.stop();
        frogDeath(player);
        //changeNumberOfLives("subtract",1); // For Testing
        //changeCurrentScore('subtract',1000); // For Testing

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
        //console.log(canMove); // For testing
    }


};