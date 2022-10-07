class Player{
    constructor(){
        

        this.velocity={
            x:0,
            y:0
        }
        this.rotation=0
        this.opacity=1
        const image= new Image()
        image.src= './images/spaceship.png'

        
        image.onload = () => {
            const scale= 0.8
            this.image= image
            this.height=image.height*scale
            this.width=image.width*scale
            this.position={
                x:canvas.width/2 - this.width/2,
                y:canvas.height-this.height-30
            }
        }
    }

    draw(){
        c.save()
        c.globalAlpha=this.opacity
        c.translate(
            player.position.x + player.width/2,
            player.position.y + player.height/2
        )
        c.rotate(this.rotation)
        c.translate(
            -player.position.x - player.width/2,
            -player.position.y - player.height/2
        )
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
        c.restore()
    }

    update(){
        if(this.image){
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile{
    constructor({position,velocity}){
        this.position= position
        this.velocity= velocity
        this.radius= 3
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle= 'burlywood'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class InvaderProjectile{
    constructor({position,velocity}){
        this.position= position
        this.velocity= velocity
        this.width= 3
        this.height= 10
    }

    draw(){
        c.fillStyle= 'red'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle{
    constructor({position,velocity,radius,color,fades}){
        this.position= position
        this.velocity= velocity
        this.radius= radius
        this.color=color
        this.opacity=1
        this.fades=fades
    }

    draw(){
        c.save()
        c.globalAlpha=this.opacity
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle= this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.fades) this.opacity -= 0.01
    }
}

class Invader{
    constructor({position}){
        
        var textArray = [
            './images/ufo1.png',
            './images/ufo2.png',
            './images/ufo3.png',
            './images/ufo4.png',
            './images/ufo5.png'
        ];
        var randomNumber = Math.floor(Math.random()*textArray.length);
        

        this.velocity={
            x:0,
            y:0
        }
        /*this.rotation=0*/
        const image= new Image()
        image.src= textArray[randomNumber]

        
        image.onload = () => {
            const scale= 0.6
            this.image= image
            this.height=image.height*scale
            this.width=image.width*scale
            this.position={
                x:position.x,
                y:position.y
            }
        }
    }

    draw(){
        /*c.save()
        c.translate(
            player.position.x + player.width/2,
            player.position.y + player.height/2
        )
        c.rotate(this.rotation)
        c.translate(
            -player.position.x - player.width/2,
            -player.position.y - player.height/2
        )*/
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
        /*c.restore()*/
    }

    update({velocity}){
        if(this.image){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles){
        invaderProjectiles.push(new InvaderProjectile({
            position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height
            },
            velocity:{
                x:0,
                y:3
            }
        }))
    }
}


class Grid{
    constructor(){
        this.position={
            x:0,
            y:0
        }
        this.velocity={
            x:3,
            y:0.1
        }
        this.invaders=[]
        
        const colums= Math.floor(Math.random()*10 + 2)
        const rows= Math.floor(Math.random()*4 + 2)

        this.width=colums*45
        this.height=rows*40

        for(let i=0;i<colums;i++){
            for(let u=0;u<rows;u++){
                this.invaders.push(new Invader({position:{
                    x:i*45,
                    y:u*40
                }}))
            }
        }
    }   

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.width+this.position.x>=canvas.width || this.position.x<=0){
            this.velocity.x= -this.velocity.x
        }
    }
}