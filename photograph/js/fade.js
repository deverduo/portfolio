const caroussel= document.querySelectorAll(".caroussel .caroussel_img");
const nextImageDelay= 4000;
let currentImageCounter= 0;
caroussel[currentImageCounter].style.opacity=1;

function nextImage(){
    caroussel[currentImageCounter].style.opacity=0;
    currentImageCounter= (currentImageCounter+1) % caroussel.length;
    caroussel[currentImageCounter].style.opacity=1;
}

setInterval(nextImage,nextImageDelay);

