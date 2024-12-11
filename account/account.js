
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('popup-container').style.display = 'none';
});

// display date navbar
const dateDisplay = document.getElementById('date-display');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateDisplay.innerText = today.toLocaleDateString(undefined, options);

// Function to handle image selection and update background
function changeImage1() {
    const input = document.getElementById('imageInput1'); // Assuming you have a file input with id 'imageInput1'

    // Trigger file input dialog
    input.click();

    input.onchange = async function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            // Once the file is loaded, set the preview in the `.cover` element
            reader.onload = function(e) {
                document.querySelector('.cover').style.backgroundImage = `url(${e.target.result})`;
            };

            // Read the selected file as a Data URL to preview it
            reader.readAsDataURL(file);

            // Prepare the file to be uploaded to the backend
            const formData = new FormData();
            formData.append('photo', file);

            // Get the username from localStorage (assuming you store it there)
            const username = localStorage.getItem('username'); 
            if (username) {
                formData.append('username', username); // Ensure the username is appended
            } else {
                console.error('Username not found in localStorage');
                return; // Stop if the username is not available
            }

            try {
                // Optionally, include a token for authentication if required by the backend
                const token = localStorage.getItem('token'); // Ensure this key matches where you store the token

                // Send the image and username to the server using fetch
                const response = await fetch('http://localhost:5000/api/auth/upload-photo', {
                    method: 'POST',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '' // Include token if available
                    },
                    body: formData, // Send the form data (image and username)
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Image uploaded successfully:', data.message);
                } else {
                    console.error('Image upload failed:', data.message);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };
}

// pfp image
function changeImage2() {
    const input = document.getElementById('imageInput2'); // Assuming you have a file input with id 'imageInput1'

    // Trigger file input dialog
    input.click();

    input.onchange = async function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            // Once the file is loaded, set the preview in the `.cover` element
            reader.onload = function(e) {
                document.querySelector('.pfp').style.backgroundImage = `url(${e.target.result})`;
            };

            // Read the selected file as a Data URL to preview it
            reader.readAsDataURL(file);

            // Prepare the file to be uploaded to the backend
            const formData = new FormData();
            formData.append('photop', file);

            // Get the username from localStorage (assuming you store it there)
            const username = localStorage.getItem('username'); 
            if (username) {
                formData.append('username', username); // Ensure the username is appended
            } else {
                console.error('Username not found in localStorage');
                return; // Stop if the username is not available
            }

            try {
                // Optionally, include a token for authentication if required by the backend
                const token = localStorage.getItem('token'); // Ensure this key matches where you store the token

                // Send the image and username to the server using fetch
                const response = await fetch('http://localhost:5000/api/auth/upload-pfp', {
                    method: 'POST',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '' // Include token if available
                    },
                    body: formData, // Send the form data (image and username)
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Image uploaded successfully:', data.message);
                } else {
                    console.error('Image upload failed:', data.message);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };
}

//send friend request
async function sendFriendRequest() {
    const yourToken = localStorage.getItem('token');
    const senderUsername = localStorage.getItem('username');
    const receiverUsername = document.getElementById('friendName').value; // Assuming 'friendName' is the ID of an input field
  
    try {
      const response = await fetch('http://localhost:5000/api/friend-requests/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}` // Include this if authentication is required
        },
        body: JSON.stringify({ senderUsername, receiverUsername })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log(result.message); // Handle success
        alert(result.message); // Optionally show a success message
      } else {
        console.error(result.message); // Handle error
        alert(result.message); // Optionally show an error message
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('An error occurred while sending the friend request.');
    }
}

// Function to load and display friend requests
async function loadFriendRequests() {
    const token = localStorage.getItem('token');
    const usen = localStorage.getItem('username'); // Retrieve username from local storage

    const apiUrl = `http://localhost:5000/api/friend-requests/requests/${usen}`; // Include username in the URL

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include token in headers
            }
        });

        const requests = await response.json();
        
        const requestTableBody = document.getElementById('friend-request');
        requestTableBody.innerHTML = ''; // Clear existing content

        if (requests.length === 0) {
            requestTableBody.innerHTML = '<tr><td colspan="2">No friend requests found.</td></tr>';
        } else {
            requests.forEach((request, index) => {
                const row = document.createElement('tr');
                
                // You can use `request.senderUsername` directly instead of using localStorage
                const senderUsername = request.senderUsername; // Assuming `senderUsername` is populated with an object that has `username`
                const receiverUsername = usen; // Already fetched username from localStorage

                row.innerHTML = `
                    <td>${senderUsername}</td>
                    <td>
                        <button onclick="acceptFriendRequest('${senderUsername}','${receiverUsername}')">Accept</button>
                        <button onclick="rejectFriendRequest('${senderUsername}','${receiverUsername}')">Reject</button>
                    </td>
                `;
                
                requestTableBody.appendChild(row);
            });
        }

    } catch (error) {
        console.log('Error loading friend requests:', error);
    }
}

//accept req
async function acceptFriendRequest(senderUsername, receiverUsername) {
    const token = localStorage.getItem('token');
    const apiUrl = `http://localhost:5000/api/friend-requests/accept/${senderUsername}/${receiverUsername}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Friend request accepted:', data.message);
            // Optionally, refresh the list of friend requests
            displayFriends();
            loadFriendRequests();
        } else {
            console.error('Error accepting friend request:', data.message);
        }
    } catch (error) {
        console.error('Error accepting friend request:', error);
    }
}

//reject req
async function rejectFriendRequest(senderUsername, receiverUsername) {
    const token = localStorage.getItem('token');
    const apiUrl = `http://localhost:5000/api/friend-requests/reject/${senderUsername}/${receiverUsername}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Friend request rejected:', data.message);
            // Optionally, refresh the list of friend requests
            displayFriends();
        } else {
            console.error('Error rejecting friend request:', data.message);
        }
    } catch (error) {
        console.error('Error rejecting friend request:', error);
    }
}

/**display friends  */
async function displayFriends() {
    const username = localStorage.getItem('username'); // Ensure username is fetched inside the function or globally
    const res = await fetch(`http://localhost:5000/api/friend-requests/show/${username}`);
    const friends = await res.json();
    console.log(friends);

    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = ''; // Clear existing friends list

    friends.friends.forEach(friend => {
        const li = document.createElement('li');
        li.innerText = friend; // Assuming friend is a string or adjust if it’s an object
        li.addEventListener('click', () => fetchFriendGameData(friend)); // Add click event to fetch game data
        friendsList.appendChild(li);
        console.log("lala",friend)
    });
}
// profile display

async function displayProfile(username) {
    try {

        //HIGHSCORE dog GETTER
        const response = await fetch('http://localhost:5000/api/game/top-scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, gameName: "dogGame" }),
        });

    
    
        if (!response.ok) { // Check if the response status is OK (status in the range 200-299)
            console.log('No response from server or response error:', response.statusText);
             // Exit early if response is not OK
            document.getElementById('high-score').innerText = `High Score: not their`;
            return;
        }
    
        const data = await response.json();
        console.log('Game score:', data.score); // Process the data as needed

        if (data.score !== undefined) {
            document.getElementById('high-score').innerText = `High Score: ${data.score}`;
        } else {
            console.error('Score not found in response data');
        }

        if (username) {
            document.getElementById('profile-name').innerText = `Name: ${username}`;
        } else {
            console.error('Username not found');
        }

        // goRilla score
        const responseG = await fetch('http://localhost:5000/api/game/top-scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, gameName: "gorillaGame" }),
          });

          if (!responseG.ok) { // Check if the response status is OK (status in the range 200-299)
            console.log('No response from server or response error:', response.statusText);
             // Exit early if response is not OK
            document.getElementById('high-scoreG').innerText = `High Score: not their`;
            return;
        }
    
        const dataG = await responseG.json();
        console.log('Game scoreG:', dataG.score); // Process the data as needed

        if (dataG.score !== undefined) {
            document.getElementById('high-scoreG').innerText = `Wins: ${dataG.score}`;
        } else {
            console.error('GORILLA Score not found in response data');
        }
        ///end

        //EMAIL AND BIRTHDAY GETTER
        const response2 = await fetch('http://localhost:5000/api/auth/userdetails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username}),
          });

          const data2 = await response2.json();

            if (data2.email !== undefined) {
                document.getElementById('email').innerText = `Email: ${data2.email}`;
            }else{
                console.error('Email not found in response data');
            }
            if(data2.birthday !== undefined){
                document.getElementById('birthday').innerText = `Birthday: ${data2.birthday}`;
            }else{
                console.error('Birthday not found in response data');
            }
            if(data2.profileImage !== undefined){
                document.querySelector('.profile .cover').style.backgroundImage = `url('http://localhost:5000/uploads/${data2.profileImage}')`;
            }
            if(data2.coverImage !== undefined){
                document.querySelector('.profile .pfp').style.backgroundImage = `url('http://localhost:5000/uploads/${data2.coverImage}')`;
            }
            console.log(data2)
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
const username2 = localStorage.getItem('username');

displayProfile(username2);
// logout
function logout(){
    localStorage.clear();
    window.location.href = '../login/login.html';
}

displayFriends();
loadFriendRequests();

async function fetchFriendGameData(friendUsername) {
    console.log("yaha ara he pehela ",friendUsername);
    try {

        // getting friends details
        const res = await fetch(`http://localhost:5000/api/auth/userdetails`
        , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: friendUsername }),
        }
        );
        const friendD = await res.json();
        console.log("friendD",friendD);


        
        // Fetch data for the "dogGame"
        const response1 = await fetch('http://localhost:5000/api/game/top-scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username:friendUsername, gameName:"dogGame" }),
        });

        if (response1.ok) {
            console.log("first found")
        }else{
            console.log("first not found")
        }

        const data1 = await response1.json();
        console.log('Friend dogGame data:', data1);

        // Fetch data for the "gorillaGame"
        const response2 = await fetch('http://localhost:5000/api/game/top-scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username:friendUsername, gameName: "gorillaGame" }),
        });

        if (response2.ok) {
            console.log("second found")
        }else{
            console.log("second not found")
        }

        const data2 = await response2.json();
        console.log('Friend gorillaGame data:', data2);

        if(data1 !== undefined && data2 !== undefined && friendD !== undefined){
            
            const coverImageUrl = friendD.coverImage ? `http://localhost:5000/uploads/${friendD.coverImage}` : './one.jpg';
            document.getElementById('friend-profile-img').src = coverImageUrl;
            
            document.getElementById('friend-name').innerText = data1.username; // Set friend's name
            document.getElementById('friend-email').innerText = friendD.email; // Set friend's email
            document.getElementById('friend-dob').innerText = `DOB: ${friendD.birthday}`; // Set friend's date of birth
            document.getElementById('game-one-score').innerText = `Score: ${data1.score || 0}`; 
            document.getElementById('game-two-wins').innerText = `Wins: ${data2.score || 0}`; 

            document.getElementById('popup-container').style.display = 'block';
        }else{
            console.log("cant display no data 1")
        }
        
        

    } catch (error) {
        console.error('dusra nai hora fetching game data:', error);
    }
}

// Close popup function
function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
}