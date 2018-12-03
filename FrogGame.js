window.onload = function() {
    bootStrap();
}

function bootStrap() {
    var globalGameState;
    var countdownTimer;
    var countdownTimerDuration;
    var game;
    var timerEvent;
    var sprite;
    var player;
    var lives;
    var deathTime;
    var canMove = true;
    var playerAlive = true;
    var yjumpDistance = 1975;
    var xjumpDistance = 750; //old 1500
    var nextSpawnTime = [500, 500, 500, 500, 500, 500];
    
    var obstacleGroup;
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
    var txt_DynamicPrompt;
    var txt_DynamicPromptMessage = "";
    var DynamicPromptTimeOfInitialDisplay;
    var snd_jump;

    var goal1;
    var goal2;
    var goal3;
    var goal4;
    var goal5;

    var barrier;

    var frogsSaved = 0;


    var game = new Phaser.Game(720, 462, Phaser.AUTO, 'game',  { preload: preload, create: create, render: render, update: update });
    var input_EnterKey;

    function preload () {

        game.load.image('img_nick', 'nick.png');
        game.load.audio('snd_jump','frogjump.wav');
        
        // LOADING ALL IMAGES
        
        game.load.image('img_placeholder', 'level1mockupplaceholder3.png');
        
        //Frog Sprites
        game.load.image('frogUp', 'frog_Sprite/frogBase.png');
        game.load.image('frogLeft', 'frog_Sprite/frog_Left.png');
        game.load.image('frogDown', 'frog_Sprite/frog_Down.png');
        game.load.image('frogRight', 'frog_Sprite/frog_Right.png');
        game.load.image('frogDead', 'frog_Sprite/deadFrog.png');
        
        //Obstacles
        game.load.image('redCar', 'Obstacles/small_Car.png');
        game.load.image('purpleCar', 'Obstacles/car.png');
        game.load.image('semi', 'Obstacles/semi.png');
        game.load.image('bike', 'Obstacles/bike.png');
        game.load.image('goal', 'frog_Sprite/savedFrog.png');
        game.load.image('log', 'Obstacles/log.png');
        game.load.image('barrier', 'Obstacles/barrier-row.png');
        

    }

    function create () {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // 
        // Initial Game State
        globalGameState = "gameplay";
        countdownTimerDuration = 30;

        // Game Timer
        countdownTimer = game.time.create(false);
        setTimer(countdownTimer, countdownTimerDuration);
        countdownTimer.start();

        // Placeholder Background
        game.add.sprite(0,0, 'img_placeholder');
        

        player = game.add.sprite(346,410, 'frogUp');
        player.frame = 0;
        player.anchor.setTo(0.5, 0.5);

        barrier = game.add.sprite(0,429, 'barrier');
        game.physics.arcade.enable(barrier);
        barrier.alpha = 0;

            
        goal1 = game.add.sprite(58,0, 'goal');
        goal1.alpha = 0;
        goal1.takenCareOf = false;

        game.physics.arcade.enable(goal1);

        goal2 = game.add.sprite(201,0, 'goal');
        goal2.alpha = 0;
        goal2.takenCareOf = false;

        game.physics.arcade.enable(goal2);

        goal3 = game.add.sprite(346,0, 'goal');
        goal3.alpha = 0;
        goal3.takenCareOf = false;

        game.physics.arcade.enable(goal3);

        goal4 = game.add.sprite(489,0, 'goal');
        goal4.alpha = 0;
        goal4.takenCareOf = false;

        game.physics.arcade.enable(goal4);

        goal5 = game.add.sprite(633,0, 'goal');
        goal5.alpha = 0;
        goal5.takenCareOf = false;

        game.physics.arcade.enable(goal5);


        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        // Time Left Text Elements
        txt_TimeLeft = game.add.text(300, 427, "Time:");
        txt_TimeLeft.fill = "#FFFFFF";
        txt_TimeLeft.anchor.set(0,0);
        txt_TimeLeft.font ='monospace';
        txt_TimeLeft.fontSize ='33px';

        timeleft_seconds = 15;
        txt_SecondsLeft = game.add.text(410, 427, timeleft_seconds);
        txt_SecondsLeft.fill = "#FF0000";
        txt_SecondsLeft.anchor.set(0,0);
        txt_SecondsLeft.font ='monospace';
        txt_SecondsLeft.fontSize ='33px';
        
        // Score Text Elements
        txt_ScoreLabel = game.add.text(5, 427, "Score:");
        txt_ScoreLabel.fill = "#FFFFFF";
        txt_ScoreLabel.anchor.set(0,0);
        txt_ScoreLabel.font ='monospace';
        txt_ScoreLabel.fontSize ='33px';

        setCurrentScore(0);
        // changeCurrentScore('add',500); // - For Testing
        txt_CurrentScoreDisplay = game.add.text(130, 427, txt_CurrentScoreValue);
        txt_CurrentScoreDisplay.fill = "#FF0000";
        txt_CurrentScoreDisplay.anchor.set(0,0);
        txt_CurrentScoreDisplay.font ='monospace';
        txt_CurrentScoreDisplay.fontSize ='33px';

        // Lives Text Elements
        txt_LivesLeftLabel = game.add.text(561, 427, "Lives:");
        txt_LivesLeftLabel.fill = "#FFFFFF";
        txt_LivesLeftLabel.anchor.set(0,0);
        txt_LivesLeftLabel.font ='monospace';
        txt_LivesLeftLabel.fontSize ='33px';

        setNumberOfLives(5);
        //changeNumberOfLives("add", 1);  // This is just a testing line
        txt_CurrentLivesLeftDisplay = game.add.text(680, 427, txt_CurrentLivesLeftValue);
        txt_CurrentLivesLeftDisplay.fill = "#FF0000";
        txt_CurrentLivesLeftDisplay.anchor.set(0,0);
        txt_CurrentLivesLeftDisplay.font ='monospace';
        txt_CurrentLivesLeftDisplay.fontSize ='33px';


        // Dynamic Text Prompt
        txt_DynamicPrompt = game.add.text(130, 213, "");
        txt_DynamicPrompt.fill = "#FF0000";
        txt_DynamicPrompt.anchor.set(0,0);
        txt_DynamicPrompt.font ='monospace';
        txt_DynamicPrompt.fontSize ='45px';

        // Audio 
        snd_jump = game.add.audio('snd_jump');
        //snd_jump.play();
        
        obstacleGroup = game.add.group();
        
        //TEST SPAWN
        //spawnObstacle(1, 365, 'redCar', 'left'); //ROAD: 365, 300, 270, SIDEWALK: 235
        
        obstacleGroup.enableBody = true;
        obstacleGroup.physics = Phaser.Physics.ARCADE;

        input_EnterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    }

    function update() { 


        //Game State Logic
        switch (globalGameState) {

            case "gameplay":

                //console.log('Gamestate Changed To: ' + globalGameState);
                gameplay();

            break;


            case "reachedGoal":

                //console.log('Gamestate Changed To: ' + globalGameState);
                reachedGoal();

            break;

            case "death":

                //console.log('Gamestate Changed To: ' + globalGameState);
                death();

            break;

            case "gameOver":

                //console.log('Gamestate Changed To: ' + globalGameState);
                gameOver();

            break;

            case "beatTheGame":

                //console.log('Gamestate Changed To: ' + globalGameState);
                beatTheGame();

            break;

        }
        
        player.bringToTop();
        //player.z = 0;
    
        
    }

    function render() {


        //game.debug.text("Current Game State: " + globalGameState, 32, 32);

        updateTimerOSD();
        updateLivesOSD();
        updateScoreOSD();
        //dynamicPrompt();
        txt_DynamicPrompt.text = txt_DynamicPromptMessage;
        txt_DynamicPrompt.bringToTop();

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

        lives = lives - 1;
        txt_CurrentLivesLeftValue = lives;
        console.log("life subtracted, current amount is " + txt_CurrentLivesLeftValue  + " current time is: " + game.time.now);

    }

    function updateLivesOSD() {

        txt_CurrentLivesLeftDisplay.text = lives;

    }

    function setTimer(spriteObject, durationInSeconds) {

       // spriteObject.add(durationInSeconds * 1000, timerEnded, this);
       // spriteObject.start();
       countdownTimer.add(durationInSeconds * 1000, timerEnded, this);

    }

    function startTimer(spriteObject) {

       // timer.start();

    }

    function timerEnded() {

        frogDeath(player);

    }

    function updateTimerOSD() {

        if (countdownTimer.length > 0) {
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

    function displaySpriteDebug(spriteObject, enabled) {
        
        if (enabled === true) {

            //console.log('Timer Debug Display enabled');
            game.debug.body(spriteObject);
            game.debug.text("spriteObject.anchor: " + spriteObject.anchor, 32, 32);
            game.debug.text("spriteObject.rotation: " + spriteObject.rotation, 32, 64);
            game.debug.text("spriteObject.pivot: " + spriteObject.pivot, 32, 96);      
            game.debug.text("centerX" + spriteObject.centerX, 32, 128);
            game.debug.text("centerY" + spriteObject.centerY, 32, 160);
            game.debug.text("body.offset" + spriteObject.body.offset, 32, 192);
            game.debug.text("body.position" + spriteObject.body.position, 32, 224);
            game.debug.text("body.rotation: " + spriteObject.body.rotation, 32, 256);
            game.debug.geom(new Phaser.Point(spriteObject.pivot.x, spriteObject.pivot.y), '#FF88FF');
            game.debug.geom(new Phaser.Point(spriteObject.anchor.x, spriteObject.anchor.y), '#FFFFFF');
            game.debug.spriteInfo(spriteObject, 32, 288);
    
        } else if (enabled == false) {
    
            //console.log('Timer Debug Display disabled');
        }
    
    }


    
    function spawnObstacle(x, y, sprite, direction, speed) {
        
        // console.log("Hello"); // - For Testing
            
        var obstacle = obstacleGroup.create(x, y, sprite);
        game.physics.arcade.enable(obstacle);
        obstacle.z = 6;
        
        obstacleMovement(obstacle, direction, speed);
        
    }
    
    
    function frogDeath(frog) {
        
        countdownTimer.removeAll();
        console.log("frogdeath called at: " + game.time.now);
        deathTime = game.time.now;
        playerAlive = false;
        subtractLife();
        frog.kill();
        globalGameState = "death";  
    }
    
    function respawnPlayer() {
        globalGameState="gameplay";
        player.reset(350,410);
        playerAlive = true;
        countdownTimer.removeAll();
        setTimer(countdownTimer, countdownTimerDuration);   
        //console.log(canMove); // For testing
    }

    function gameOver() {

        if(game.time.now > deathTime + 3000 && input_EnterKey.downDuration(500))
        {
            txt_DynamicPromptMessage = "";
            setTimer(countdownTimer, countdownTimerDuration);
            setNumberOfLives(5);
            goal1.alpha = 0;
            goal1.takenCareOf = false;
            console.log('department of the interior:' + globalGameState);
            respawnPlayer();
            //globalGameState = "gameplay";                    
        } else {
            console.log('whatever');
            txt_DynamicPromptMessage = "GAME OVER\nPress\nENTER KEY\nto continue";
        }

    }

    function death() {

        if (lives > 0 && game.time.now > deathTime + 1000) {
            respawnPlayer();
        } else if (lives == 0) {
             globalGameState = "gameOver";
        }

    }


    function frogMovement() {

        //Movement
        cursors = game.input.keyboard.createCursorKeys();
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.up.isDown) {
            //  Move up
            while(canMove){
                player.angle = 0;
                player.body.velocity.y = -yjumpDistance;
                canMove = false;
                
            }
        } else if (cursors.down.isDown){
            //  Move down
            while(canMove){
                player.angle = 180;
                player.body.velocity.y = yjumpDistance;
                canMove = false;
                
                
            }
        } else if (cursors.right.isDown){
            //  Move to the right
            while(canMove){
                player.angle = 90;
                player.body.velocity.x = xjumpDistance;
                canMove = false;
                
            }
        } else if (cursors.left.isDown){
            //  Move to the left
            while(canMove){
                player.angle = 270;
                player.body.velocity.x = -xjumpDistance;
                canMove = false;
                
            }
        } else {
            canMove = true;
        }

    }

    function frogCollisionDetection() {

        //Revamped Collision detection
        
        for (var i = 0; i < obstacleGroup.countLiving(); i++) {
            
            if (checkOverlap(player, obstacleGroup.children[i])){
                
                frogDeath(player);
                
            }    
            
        }
        
        
        if (checkOverlap(player, barrier)){
            player.y = player.y - 33;
        }

        if (checkOverlap(player, goal1)){
            reachedGoal(player, goal1);
        }
        
        if (checkOverlap(player, goal2)){
            reachedGoal(player, goal2);
        }
        
        if (checkOverlap(player, goal3)){
            reachedGoal(player, goal3);
        }
        
        if (checkOverlap(player, goal4)){
            reachedGoal(player, goal4);
        }
        
        if (checkOverlap(player, goal5)){
            reachedGoal(player, goal5);
        }
        
        //Collision Detection 
        /*
        if (playerAlive) {
            game.physics.arcade.collide(player, obstacle, frogDeath, null, this);
            game.physics.arcade.collide(player, goal1, reachedGoal, null, this);
            game.physics.arcade.collide(player, goal2, reachedGoal, null, this);
            game.physics.arcade.collide(player, goal3, reachedGoal, null, this);
            game.physics.arcade.collide(player, goal4, reachedGoal, null, this);
            game.physics.arcade.collide(player, goal5, reachedGoal, null, this);
        
        } else {

            }*/

    }
    
    //Overlap Detection
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
       
    function spawnRate(variation) {
        
        var variation = Math.floor(Math.random() * (variation + 1));
        if (variation % 2 == 0) {
            //console.log(variation);
            return variation;
        } else {
            //console.log("-" + variation);
            return -variation;
        }
        
    }
    
    /*function obstacleMovement() {

        obstacle.body.velocity.x = obstacleSpeed;


        if (!obstacle.inCamera) { 
             
            obstacle.destroy(); 
             
        } 

    }*/


    function obstacleMovement(obstacle, direction, speed) {

        if (direction == "right") {
            obstacle.body.velocity.x = -speed;
        } else if (direction == "left") {
            obstacle.body.velocity.x = speed;
        }


        if (!obstacle.inCamera) { 
             
            obstacle.destroy(); 
             
        } 

    }
    


    function gameplay() {


        frogMovement();
        frogCollisionDetection();
        //obstacleMovement();
        
        var spawn = spawnRate();
        
        //ROAD: 365, 300, 270  SIDEWALK: 235
        
        //REVAMPED SPAWNING
        if(game.time.now > nextSpawnTime[1]) {
            
            spawnObstacle(1, 365, 'redCar', 'left', 50);
            nextSpawnTime[1] = game.time.now + 2000 + spawnRate(500);
        
        }
        
        if(game.time.now > nextSpawnTime[2]) {

            spawnObstacle(720, 332, 'semi', 'right', 80);            
            nextSpawnTime[2] = game.time.now + 2500 + spawnRate(1000);
        
        }
        
        if(game.time.now > nextSpawnTime[3]) {
        
            spawnObstacle(1, 300, 'purpleCar', 'left', 40);    
            nextSpawnTime[3] = game.time.now + 3000 + spawnRate(1000);
        
        }
        
        if(game.time.now > nextSpawnTime[4]) {
            
            spawnObstacle(720, 270, 'redCar', 'right', 50);        
            nextSpawnTime[4] = game.time.now + 3000 + spawnRate(1000);
        
        }
        
        if(game.time.now > nextSpawnTime[5]) {

            spawnObstacle(1, 235, 'bike', 'left', 30);    
            nextSpawnTime[5] = game.time.now + 3500 + spawnRate(1000);
        
        }
                
        
        //Old Spawning
        /*
        if (spawn == 1) {
            
            spawnObstacle(1, 365, 'img_nick', 'left');
            
        }
        
        if (spawn == 2) {
            
            spawnObstacle(720, 332, 'img_nick', 'right');
            
        }
        
        if (spawn == 3) {
            
            spawnObstacle(1, 300, 'img_nick', 'left');
            
        }
        
        if (spawn == 4) {
            
            spawnObstacle(720, 270, 'img_nick', 'right');
                        
        }
        
        if (spawn == 5) {
            
            spawnObstacle(1, 235, 'img_nick', 'left');
            
        }
        */

        if (game.time.now > DynamicPromptTimeOfInitialDisplay + 5000 && txt_DynamicPromptMessage != ""){

            txt_DynamicPromptMessage = "";

        }

        if (frogsSaved == 5) {

            globalGameState = "beatTheGame";

        }
        

    }

    function reachedGoal(playerObject,goalObject) {

        if (goalObject.takenCareOf == false) {
            console.log("You Saved a Frog!");
            frogsSaved++;
            countdownTimer.removeAll();
            setTimer(countdownTimer, countdownTimerDuration);  
            console.log(timeleft_seconds.toFixed(0) + " when saved");
            changeCurrentScore('add', timeleft_seconds.toFixed(0) * 50);

            player.reset(350,428);
            goalObject.alpha = 1.0;
            goalObject.takenCareOf = true;
            DynamicPromptTimeOfInitialDisplay = game.time.now;
            if (frogsSaved == 1){
                txt_DynamicPromptMessage = "YOU HAVE SAVED\n " + frogsSaved + " FROG";    
            } else if (frogsSaved > 1) {
                txt_DynamicPromptMessage = "YOU HAVE SAVED\n " + frogsSaved + " FROGS";    
            }
            
        } else {
            console.log("Your Frog is in Another Castle");
            changeCurrentScore('subtract',100);
            DynamicPromptTimeOfInitialDisplay = game.time.now;
            txt_DynamicPromptMessage = "Your Frog is\nin Another Castle";
            player.reset(350,428);
        }

    }


    function beatTheGame() {

            console.log('Game Beaten!');
            player.kill();
            txt_DynamicPromptMessage = "YOU HAVE SAVED\nALL FIVE FROGS\nTHE END";
            countdownTimer.removeAll();


    }

};


