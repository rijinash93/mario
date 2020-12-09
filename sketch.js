var bg, mario, marioA, ground, groundI, invisibleground, obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstaclesGroup, BricksGroup, jumpSound;
var score, bricks, brickImage, marioC;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  bgImage = loadImage("bg.png");
  marioA = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png")

  groundI = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  brickImage = loadImage("brick.png")
  marioC = loadAnimation("collided.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

}


function setup() {


  obstaclesGroup = new Group();
  BricksGroup = new Group();
  score = 0;
  createCanvas(600, 250);

  bg = createSprite(180, 200, 800, 400);
  bg.addAnimation("bg", bgImage);
  bg.scale = 1.2;

  mario = createSprite(50, 140, 20, 20);
  mario.addAnimation("m1", marioA);
  mario.addAnimation("collided", marioC);

  ground = createSprite(300, 220, 600, 5);
  ground.addImage("g1", groundI);

  edges = createEdgeSprites();
  invisibleground = createSprite(300, 190, 600, 10);
  invisibleground.visible = false;

  mario.debug = true;
  mario.setCollider("rectangle", 0, 0, 45, 45)

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140)
  restart.addImage(restartImg)

  gameOver.scale = 0.5;
  restart.scale = 0.5;

}

function draw() {
  fill(0)
  background("skyblue")

  
  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    score = score + 0.2;
    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }
    if (keyDown("space") && mario.y > 100) {

      mario.velocityY = -10;
      jumpSound.play();
    }
    mario.velocityY = mario.velocityY + 0.5;
    ground.velocityX = -2;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    spawnObstacles()
    spawnBricks();
    if (BricksGroup.isTouching(mario))

    {
      
      score = score + 1;
    }
    if (obstaclesGroup.isTouching(mario)) {
      mario.velocityY=0;
      dieSound.play()
      gameState = END;
    }
  } else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    mario.velocityX = 0;

    mario.changeAnimation("collided", marioC);
    obstaclesGroup.setVelocityXEach(0);
    BricksGroup.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1);
    BricksGroup.setLifetimeEach(-1);
    if (mousePressedOver(restart)) {
      reset()
    }
  }


  text("Score: " + Math.round(score), 540, 50);

  mario.collide(invisibleground);
  drawSprites();
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false
  obstaclesGroup.destroyEach();
  BricksGroup.destroyEach();
  mario.changeAnimation("m1", marioA);
  score = 0;
}

function spawnBricks() {
  if (frameCount % 60 == 0) {
    var bricks = createSprite(400, 100, 20, 20);
    bricks.addImage("b1", brickImage);
    bricks.y = Math.round(random(80, 120));
    bricks.velocityX = -2;
    bricks.lifetime=150;
    BricksGroup.add(bricks);
  }
}

function spawnObstacles() {
  if (frameCount % 120 == 0) {
    var obstacle = createSprite(200, 165, 10, 40);
    obstacle.velocityX = -(2 + score / 50);
    //  console.log(Math.round(random(1,4))+" "+frameCount);

    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      default:
        break;


    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    obstaclesGroup.add(obstacle);
    console.log(ground.x)

  }
}