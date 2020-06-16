class Spirograph {
    constructor(ctx, startx, starty, radius1, radius2, theta, scalar, color1, color2, color3, color4){
        this.ctx = ctx;
        this.radius1 = radius1;
        this.radius2 = radius2;

        this.strokeColor = color1;
        this.strokeColor1 = color1;
        this.strokeColor2 = color2;
        this.strokeColor3 = color3;
        this.strokeColor4 = color4;

        this.prevx = 0;
        this.prevy = 0;
        
        this.startx = startx;
        this.starty = starty;

        this.angle = 0;
        this.theta = theta / 100;
        this.scalar = scalar;
        
   
        // Epitrochoid
        this.x = this.startx + (this.radius2 - this.radius1) * Math.cos(this.angle) + this.scalar * Math.cos(((this.radius2-this.radius1)/this.radius1)*this.angle)
        this.y = this.starty + (this.radius2 - this.radius1) * Math.sin(this.angle) - this.scalar * Math.sin(((this.radius2-this.radius1)/this.radius1)*this.angle)
    }
    
    /**
     * Update the spiro's angle, x and y coords
     */
    update(){
        this.angle = this.angle + this.theta;
        
        this.prevx = this.x;
        this.prevy = this.y

        // Epitrochoid
        this.x = this.startx + (this.radius2 - this.radius1) * Math.cos(this.angle) + this.scalar * Math.cos(((this.radius2-this.radius1)/this.radius1)*this.angle)
        this.y = this.starty + (this.radius2 - this.radius1) * Math.sin(this.angle) - this.scalar * Math.sin(((this.radius2-this.radius1)/this.radius1)*this.angle)
        
    }
    
    /**
     * Returns a six-digit, hex stroke color based on the spirograph's
     * current angle
     */
    getStrokeColor(){
        if(Math.cos(this.angle) >= 0 && Math.sin(this.angle) >= 0) {
            this.strokeColor = this.strokeColor1;
        } else if(Math.cos(this.angle) < 0 && Math.sin(this.angle) >= 0){
            this.strokeColor = this.strokeColor2;
        } else if (Math.cos(this.angle) < 0 && Math.sin(this.angle) < 0) {
            this.strokeColor = this.strokeColor3;
        } else if (Math.cos(this.angle) > 0 && Math.sin(this.angle) < 0) {
            this.strokeColor = this.strokeColor4;
        }
        
      // console.log('color', this.strokeColor)
        return this.strokeColor
    }

    /**
     * Draw spiros current position on canvas
     */
    draw(){
        this.ctx.strokeStyle = this.getStrokeColor();
        this.ctx.lineWidth = 2;
        this.ctx.beginPath()
        this.ctx.moveTo(this.prevx, this.prevy);
        this.ctx.lineTo(this.x, this.y)
        this.ctx.stroke()
        this.ctx.fill();
    }
}

let canvas, centerx, centery, container, 
    count, ctx, frameRequest, spiro, steps;


/** 
* Return an object containing spirograph parameters from DOM inputs
*/
function getDomData(){
    let elems = document.querySelectorAll('.control input')    

    let domData = {
        bgColor: elems[0].value,
        radius1: elems[1].value,
        radius2: elems[2].value,
        theta  : elems[3].value,
        scalar : elems[4].value,
        color1 : elems[5].value,
        color2 : elems[6].value,
        color3 : elems[7].value,
        color4 : elems[8].value,
    }

    return domData
}

/**
 * Setup canvas and instantiate Spirograph() object
 */
function init(){
    let domData = getDomData(); // get Spiro arguments from DOM inputs

    canvas = document.querySelector('canvas');
    
    canvas.height = canvas.parentElement.offsetHeight;
    canvas.width = canvas.parentElement.offsetWidth;
    
    if(window.innerWidth < 991.98){
      canvas.height = window.innerHeight * .9;
      canvas.width = window.innerWidth * .8;
    }
  
    // find center of canvas
    centerx = canvas.width / 2;
    centery = canvas.height / 2;
    
    ctx = canvas.getContext('2d');

    // Instantiate spirograph class
    spiro = new Spirograph(
        ctx,
        centerx,
        centery,
        domData.radius1,
        domData.radius2,
        domData.theta,
        domData.scalar,
        domData.color1,
        domData.color2,
        domData.color3,
        domData.color4,
    );
    
    
    steps = ((spiro.radius1 + spiro.radius2) * (2 *Math.PI)) 
            / Math.abs(spiro.radius1 - spiro.radius2) + spiro.scalar//(Math.abs(spiro.radius1 - spiro.radius2) * Math.PI) * (spiro.scalar)
}

/**
* Main animation function. Called every frame
* Updates spiro numbers and redraws
*/
function draw(){
    
    console.log('\nangle', spiro.angle * 180 / (2*Math.PI))
    let deg = spiro.angle * 180 / (2 * Math.PI)

    console.log('steps', steps)
    if(deg < steps){
        spiro.update()
        spiro.draw()

        frameRequest = window.requestAnimationFrame(draw);
    } else {
        window.cancelAnimationFrame(frameRequest)
    }
}

// Setup canvas
init()

let startButton = document.querySelector('#submit');
let pauseButton = document.querySelector('#pause');
let clearButton = document.querySelector('#clear');
let bgColorInput = document.querySelector('#bg-color');


/**
* Begin new animation
*/
startButton.addEventListener('click', () => {
    // end previous animation
    // spiro = null;
    window.cancelAnimationFrame(frameRequest)

    // 
    frameRequest = window.requestAnimationFrame(draw);
})

/**
* pause current spiro animation
*/
pauseButton.addEventListener('click', () => {
    window.cancelAnimationFrame(frameRequest)
})

/**
* Button to clear canvas and erase current spiro
*/
clearButton.addEventListener('click', () => {
    window.cancelAnimationFrame(frameRequest)
    spiro = null;
    init();
})

/**
* Change canvas color on color input
*/
bgColorInput.addEventListener('input', () => {
    canvas.style.backgroundColor = bgColorInput.value;
})

/**
* Resize and reset canvas on window resize
*/
window.addEventListener('resize', () => {
  init();
})