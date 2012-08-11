/**
 * @class MyApp.view.BrickBreaker
 * @extends Ext.draw.Component
 * @author Armando Gonzalez <iam@armando.mx>
 * This is the BrickBreaker component
 */
Ext.define('MyApp.view.BouncingBall', {
    extend: 'Ext.draw.Component',
    alias: 'widget.bouncingball',
    style: {
        backgroundImage: "url('resources/images/back.jpeg')" // our game backgroung image
    },
    width: 700,
    height: 445,
    ballSize: 30,
    mute: 0,
    colors: ['#D300CD', '#0FCA0B', '#EDAB55', '#2D2DE5', '#610097', '#F7E70E'], // posible brick colors
    barWidth: 150,
	brickWidth: 50,
	brickHeight: 20,
    bricksForm: [ // this is the layout of our bricks, 1 sets a brick, 0 lives an empty space
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 0, 1, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 0, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    runner: new Ext.util.TaskRunner(), //create a runner to loop the ball
    afterRender: function () {
        var me = this;
        //Adding some sound to our bouncing ball		
        me.sound = new Audio("resources/sounds/toing.mp3"); // buffers automatically when created
        this.callParent(arguments);

        me.configureBall();
        me.configureBar();
        me.configureBricks();

        me.configureMovement();
		me.configureKeyNavigation();

        //adding the mouseover listener to the bar
        me.bar.addListener('mouseover', me.moveBar);

    },
    configureBall: function () { // setting the ball 
        var me = this;
        me.ball = new Ext.draw.Sprite({ // we create the ball sprite
            type: 'image',
            src: "resources/images/ball.png",
            height: me.ballSize,
            width: me.ballSize
        });
        me.surface.add(me.ball);
        me.ball.setAttributes({ // setting the ball attribute
            y: me.height - (30 + me.ballSize),
            x: 90
        }, true);
    },
    configureBar: function () { //set the bouncing ball bar
        var me = this;
        me.bar = new Ext.draw.Sprite({ // we create the ball sprite
            type: 'rect',
            width: me.barWidth,
            height: 20,
            opacity: 0.75,
            fill: 'black',
            stroke: 'orange',
            'stroke-width': 2
        });
        me.surface.add(me.bar);
        me.bar.setAttributes({ // setting the brick attribute
            y: me.height - 30,
            x: 90
        }, true);
    },
    configureBricks: function () { // we set the bricks in our drawing component
        var me = this,
            brick;
        me.bricks = [], colors = me.colors;
        Ext.each(me.bricksForm, function (row, rindex, items) {
            Ext.each(row, function (col, cindex, items) {
                if (col) {
                    brick = new Ext.draw.Sprite({
                        type: 'rect',
                        width: me.brickWidth,
                        height: me.brickHeight,
                        opacity: 0.75,
                        fill: colors[Math.floor(Math.random() * colors.length)] // this will generate a random color from the colors avaliable
                    });
                    me.bricks.push(brick);
                    me.surface.add(brick);
                    brick.setAttributes({ // setting the brick attribute
                        y: 10 + (22 * rindex),
                        x: 90 + (52 * cindex)
                    }, true);
                }
            });
        });
    },
    configureMovement: function () {
        var me = this,
            dx = 5,
            dy = 5,
            x = 90,
            y = me.height - (30 + me.ballSize);
        me.task = me.runner.newTask({ //start a task
            run: function () {
                me.ball.setAttributes({ //change the ball position
                    y: y,
                    x: x
                }, true); // the true value redraws tha ball

                if (x < 0 || x > me.width - me.ballSize) { // validation to change the x direction when it reaches left/right
                    dx = -dx;                
                }			
                //bounce with bar	
                if (y < 0 || me.ballHitsBar(x, y, me)) { // validation to change the y direction when the ball reaches top/bottom
                    dy = -dy;
					if (!me.mute) {
                        me.sound.play();
                    }
                }
                //game over
                if (y > me.height) {
                    alert('Game Over :(');
                    me.task.stop();
                }
				//check when the ball hits a brick
				if(me.destroyBrick(x,y)){
					dy = -dy;
					if (!me.mute) {
                        me.sound.play();
                    }
				}
                y += dy; //adding pixels to change the ball´s position
                x += dx;
            },
            interval: 10 // this goes on every 10 milliseconds
        });
    },
    initMovement: function () { //start the game
        var me = this;
        me.task.start(); // start the task
        me.el.unmask();
    },
    pauseMovement: function () { //pause the game
        var me = this;
        me.el.mask('Paused ...');
        me.task.stop();
    },
    muteSound: function () {
        var me = this;
        me.mute = !me.mute;
    },
    ballHitsBar: function (x, y, me) { //check when the ball hits the bar
        var barStart = me.bar.attr.x,
            barEnd = me.bar.attr.x + me.barWidth;
        if (y > me.bar.attr.y - me.ballSize && (x >= barStart && x <= barEnd)) {
            return true
        } else {
            return false;
        }
    },
    moveBarLeft: function () { //changing the bar direction with the mouse
		var me = this;
       	 me.bar.setAttributes({ 	           
	            x: me.bar.attr.x - me.barWidth
	        }, true);
    },
	moveBarRight: function () { //changing the bar direction with the mouse
		var me = this;
       	 me.bar.setAttributes({ 	           
	            x: me.bar.attr.x + me.barWidth
	        }, true);
    },
	configureKeyNavigation:function(){ //configute the key navigation
		var me = this, nav;
		nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
	        scope: me,
	        left: me.moveBarLeft,
	        right: me.moveBarRight,
	        space: me.initMovement
	    });
	},
	destroyBrick:function(x,y){
		var me = this, destruir = false;
		Ext.each(me.bricks,function(brick,index){
			if( (y > brick.attr.y && y < (brick.attr.y + me.brickHeight)) && (x >= brick.attr.x  && x <= brick.attr.x + me.brickWidth )){
				me.surface.remove(brick);
				me.bricks.remove(index);		
				destruir = true;
				if(Ext.isEmpty(me.bricks)){
					alert('Win!!! :)')
				}
				return false;
			}
		});
		return destruir;
	}
});