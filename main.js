var jsonObj = getUrlParameters();
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-canvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var present;
var presentFake;
var platforms;
var platformsInvis;
var cursors;
var movingPlatform;
var inverted = false;
var rightWasReleased = false;
var game = new Phaser.Game(config);
var runSpeed = 250;
var jumpSpeed = 650;
var overlay;
function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('ground_100', 'assets/platform_100.png');
    this.load.image('ground_50', 'assets/platform_50.png');
    this.load.image('ground_25', 'assets/platform_25.png');
    this.load.image('present', 'assets/present_small_red.png');
    this.load.image('presentFake', 'assets/present_small_yellow.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    
}
function render(){
    
}
function create ()
{
    this.add.image(400, 300, 'sky');
   overlay = document.querySelector('.tutorial')
   
    platforms = this.physics.add.staticGroup();
    platformsInvis = this.physics.add.staticGroup();

    platforms.create(1, 568, 'ground').setScale(1).refreshBody();
    
    platforms.create(400, 500, 'ground_50');
    platforms.create(600, 600, 'ground_25');
    platforms.create(740, 500, 'ground_50');
    platforms.create(780, 400, 'ground_25');

    platforms.create(500, 335, 'ground');
    platforms.create(200, 300, 'ground_25');
    platforms.create(50, 250, 'ground_100');

    platforms.create(90, 125, 'ground_25');
    platforms.create(100, 118, 'ground_25');
    platforms.create(100, 150, 'ground_25');
    platformsInvis.create(200, 100, 'ground_25');
    platformsInvis.create(320, 100, 'ground_25');
    platformsInvis.create(440, 100, 'ground_25');
    platformsInvis.create(560, 100, 'ground_25');
    platforms.create(750, 100, 'ground_100');
    player = this.physics.add.sprite(100, 450, 'dude').setGravity(0, 1500);
    present = this.physics.add.sprite(750, 0, 'present');
    presentFake = this.physics.add.sprite(40, 0, 'presentFake');
    presentFake.name = "FAKE";
    player.setBounce(0);
    //player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, platformsInvis);
    this.physics.add.collider(present, platforms);
    this.physics.add.collider(presentFake, platforms);
    this.physics.add.overlap(player, present, collectPresent, null, this);
    this.physics.add.overlap(player, presentFake, collectPresent, null, this);
}
function spawnCharacter(){
    player.x = 100;
    player.y = 450;
    inverted = false;
    toggleInvisOnPlatforms(platformsInvis,true);
    present.enableBody(true, 750,0,true,true);
    presentFake.enableBody(true, 40,0,true,true);
}
function invertUpdate(){
    
    if (cursors.left.isDown)
    {
        player.setVelocityX(runSpeed);

        player.anims.play('right', true);
    }
    else if (cursors.right.isDown && inverted==true)
    {
        inverted = false;
        rightWasReleased = false;
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.down.isDown && player.body.touching.down)
    {
        player.setVelocityY(-jumpSpeed);
    }
}
function toggleInvisOnPlatforms(pInvis,show){
    pInvis.children.iterate(function (child) {
        if(show === false){
            child.visible = false;
        }
        else if(show === true){
            child.visible = true;
        }
     });
}
function update ()
{
    if(cursors.right.isDown && inverted==false && rightWasReleased){
        inverted = true;
        rightWasReleased = false
    }
    if(cursors.right.isUp){
        rightWasReleased = true;
    }
    if(inverted && rightWasReleased){
        invertUpdate();
    }
    else{
        if (cursors.left.isDown)
        {
            player.setVelocityX(-runSpeed);
    
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            
        }
        else
        {
            player.setVelocityX(0);
    
            player.anims.play('turn');
        }
    
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-jumpSpeed);
        }
    }
    if(player.y > 600 || player.x < -1 || player.x > 801){
        spawnCharacter();
        
    }
}

function collectPresent (player, present)
{
    if(present.name === "FAKE"){
        toggleInvisOnPlatforms(platformsInvis,false);
    }
    else{
        writeToHtml("GL??DELIG JUL! "+jsonObj.name+". Send : '"+jsonObj.code+"' til mig p?? discord :)");
    }
    present.disableBody(true, true);
}
function writeToHtml(message){
    overlay.innerHTML = message;
}