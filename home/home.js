document.addEventListener('DOMContentLoaded', function() {
    const dateDisplay = document.getElementById('date-display');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = today.toLocaleDateString(undefined, options);
    



//sliding image
const imageArray = [
    './assets/speedypup.jpg', // Replace with your image URLs
    './assets/gorilla.jpg',
    './assets/speedypup3.jpg',
    './assets/gorilla2.jpg',
    './assets/bg.jpg',
];

let currentImageIndex = 0;

// Get the image element in the featured section
const featuredImage = document.querySelector('.featuredimage img');

// Function to change the image
function changeImage() {
    // Update the image source to the next image in the array
    featuredImage.src = imageArray[currentImageIndex];

    // Increment the index or reset if we've reached the end
    currentImageIndex = (currentImageIndex + 1) % imageArray.length;
}

// Call changeImage every 3 seconds (3000 milliseconds)
setInterval(changeImage, 3000);

// Optional: Call it initially to set the first image
changeImage();
});

function logout(){
    localStorage.clear();
    window.location.href = '../login/login.html';
}
function gorillapage(){
    
    window.location.href = '../gotillaGame/index2.html';
}