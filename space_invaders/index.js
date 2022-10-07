const canvas= document.querySelector('canvas')
const scoreEl= document.querySelector('#scoreEl')
const scoreEl2= document.querySelector('#scoreEl2')
const scoreEl3= document.querySelector('#scoreEl3')

const start_menu= document.querySelector('#start_menu')
const c= canvas.getContext('2d')

canvas.width= window.innerWidth
canvas.height= window.innerHeight

const background_music= new Audio('./sound/backsong.mp3')
background_music.volume=0.5
const explose= new Audio('./sound/explosion.wav')
explose.volume=0.5

background_music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

const player= new Player()
const projectiles= []
const grids= []
const invaderProjectiles= []
const particles= []

let game={
    over: true,
    active: false
}
let score= 0
let frames= 0
const keys={
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    space:{
        pressed:false
    }
}

for(let i=0;i<70;i++){
    particles.push(new Particle({
        position:{
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height
        },
        velocity:{
            x:0,
            y:2
        },
        radius:1,
        color: 'white'
    }))
}



function createParticles({object,color,fades}){
    for(let i=0;i<15;i++){
        particles.push(new Particle({
            position:{
                x:object.position.x+object.width/2,
                y:object.position.y+object.height/2
            },
            velocity:{
                x:(Math.random()-0.5)*2,
                y:(Math.random()-0.5)*2
            },
            radius:Math.random()*3,
            color: color || '#FFB319',
            fades
        }))
    }
}

function check(){
    if(!game.active) return
}

function check2(){
    if(game.over) return
}

function play(){
    console.log("start")
    canvas.style.display= 'block'
    start_menu.style.display= 'none'
    game.active= true
    game.over= false
    scoreEl3.style.color='white'
    score=0
    background_music.play()
    scoreEl.innerHTML=score
    grids.length=0
    projectiles.length=0
    invaderProjectiles.length=0
    player.opacity=1
    player.position.x= canvas.width/2 - player.width/2,
    player.position.y= canvas.height-player.height-30
    grids.push(new Grid())
}

function animate(){
    check()
    requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    
    particles.forEach((particle,index) =>{
        if(particle.position.y >=canvas.height){
            particle.position.x=Math.random()*canvas.width
            particle.position.y=-particle.radius
        }
        if(particle.opacity <=0){
            setTimeout(() => {
                particles.splice(index,1)
            }, 0);
        }
        else{
            particle.update()
        }
    })

    //player lose
    invaderProjectiles.forEach((invaderProjectile,index) =>{
        if(invaderProjectile.position.y+invaderProjectile.height>=canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(index,1)  
            }, 0);
        }
        else{
            invaderProjectile.update()

            if(invaderProjectile.position.y+invaderProjectile.height >= player.position.y &&
                invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
                invaderProjectile.position.x <= player.position.x + player.width){
                    setTimeout(() => {
                        explose.play()
                        invaderProjectiles.splice(index,1) 
                        player.opacity=0
                        game.over= true 
                    }, 0);
                    setTimeout(() => {
                        game.active= false
                        scoreEl2.innerHTML=score
                        background_music.pause();
                        background_music.currentTime = 0;
                        scoreEl3.style.color='black'
                        canvas.style.display= 'none'
                        start_menu.style.display= 'block'
                    }, 2000);
                    createParticles({
                        object: player,
                        color: 'white',
                        fades: true
                    })
                }
        }
        
        
    })
    
    grids.forEach((grid,gridIndex) =>{
        grid.update()
        // spawn invader projectiles
        if(frames % 50 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles)
        }
        
        grid.invaders.forEach((invader,i) =>{
            invader.update({velocity:grid.velocity})
            

            //projectile invader collision
            projectiles.forEach((projectile,j) =>{
                if(
                    projectile.position.y-projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.y + projectile.radius >= invader.position.y &&
                    projectile.position.x +projectile.radius >= invader.position.x &&
                    projectile.position.x + projectile.radius <= invader.position.x + invader.width 
                ){
                    
                    setTimeout(() =>{
                        const invaderFound= grid.invaders.find((invader2) =>{
                            return invader2 === invader
                        })
                        const projectileFound= projectiles.find((projectile2) =>{
                            return projectile2 === projectile
                        })
                        //projectile hit enemy
                        if(projectileFound && invaderFound){
                            score+=1
                            scoreEl.innerHTML=score
                            createParticles({
                                object: invader,
                                fades: true
                            })
                            grid.invaders.splice(i,1)
                            projectiles.splice(j,1)

                            if(grid.length >0){
                                const first =grid.invaders[0]
                                const last =grid.invaders[grid.invaders.length -1]
                                grid.width= last.position.x - first.position.x + last.width
                                grid.position.x=first.position.x
                            }
                            else{
                                grids.slice(gridIndex,1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })
    
    invaderProjectiles.forEach((invaderProjectile) =>{
        invaderProjectile.update()
    })
    projectiles.forEach((projectile,index) =>{
        if(projectile.position.y+projectile.radius<=0){
            setTimeout(() => {
                projectiles.splice(index,1)  
            }, 0);
        }
        else{
            projectile.update()
        }
        
        
    })

    

    if(frames % 500 === 0 ){
        grids.push(new Grid())
    }
    frames++

    if(keys.ArrowLeft.pressed && player.position.x>= 0){
        player.velocity.x= -6
        player.rotation= -0.2
    }
    else if(keys.ArrowRight.pressed && player.position.x<= canvas.width-player.width){
        player.velocity.x= 6
        player.rotation= 0.2
    }
    else{
        player.velocity.x= 0
        player.rotation= 0
    }
}
    

animate()

addEventListener('keydown',({key}) => {
    check2()
    switch(key){

        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed=true
            break

        case ' ':
            projectiles.push(new Projectile({
                position:{
                    x: player.position.x+player.width/2,
                    y: player.position.y
                },
                velocity:{
                    x:0,
                    y:-10
                }
            }))
            
            break
    }

})

addEventListener('keyup',({key}) => {
    check2()
    switch(key){
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed=false
            break

        
    }

})
/*addEventListener('mousemove', function(e){
    let xPlayer = player.position.x
    if(e.clientX>=player.width/2 && e.clientX<=canvas.width-player.width/2){       
        player.position.x=e.clientX-player.width/2 
    }
})*/