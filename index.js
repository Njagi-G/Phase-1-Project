//Initializing and Calling Functions for "mouseover" and "mouseout" Events on "navbar"

let title2 = document.querySelector(".navbar");

title2.addEventListener("mouseover", handleMouseOver);

function handleMouseOver(e) { 
    let target = e.target;
    target.style.background = "gold";
}

title2.addEventListener("mouseout", handleMouseOut);

function handleMouseOut(e) {
    let target = e.target;
    target.style.background = "";
}

//Initializing and Calling "click" Event Function on Clicking "h2" tag ("Manage Riders" heading)

let heading = document.querySelector(".subtitle");
let originalText = heading.textContent;

heading.addEventListener("click", handleClick);

function handleClick() {
    let newText = "Fill all Fields in the Form Below";
    heading.textContent = newText;
} 

//Initializing and Calling "double-click" Event Function on Double-Clicking "h2" tag ("Manage Riders" heading)

heading.addEventListener("dblclick", handleDblclick);

function handleDblclick() {
    heading.textContent = heading.textContent === "Fill all Fields in the Form Below" ? originalText : "Fill all Fields in the Form Below";
}

// Initializing and Calling "click alert" Event on "nav-bar" ("MySaccoMyRide")

let title1 = document.querySelector("#top");

title1.addEventListener("click", helloClick);

function helloClick() {
    alert("Welcome to MySaccoMyRide, the home of responsible bodaboda riders!");
}

//CRUD OPERATIONS SECTION (Creating APIS-->Targeting the Online Form)

// 1. POST REQUEST SECTION (POST /riders) --> CREATE OPERATION

let baseUrl = "http://localhost:3000";  //Assign Server-Side Url

let form = document.querySelector(".m-4");
form.addEventListener("submit", pushSubmit);  //Attaching Submit Event Listener to the Form on index.html
             

//POST /riders

function pushSubmit(e) {
    e.preventDefault();  //Prevent the form from refreshing the page after submit

    let riderFormData = {
        registrationdate: e.target.registrationdate.value,
        profilephoto: e.target.profilephoto.value,
        ridername: e.target.name.value,
        age: e.target.age.value,
        nationalID: e.target.national_id.value,
        email: e.target.email.value,
        mobilenumber: e.target.mobile.value,
        physicaladdress: e.target.address.value,
        bikeplate: e.target.bike_plate.value
    }

    e.target.reset(); //Reset the form after Submit

    fetch(`${baseUrl}/riders`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },

        body: JSON.stringify(riderFormData)
    })

    .then(res => {
        if(res.ok) {
            return res.json()
        } else {
            throw new Error("Failed to create the resource!")
        }
    })

    .then(data => {
        addRiders(data)
    })
    
    .catch(err => console.error({
        "Error": err
    }))
} 
//END OF POST REQUEST CODE BLOCK


// 2. GET REQUEST SECTION (GET /riders/id) --> FETCH (READ OPERATION)

//GET /riders

function getRiders() {

    fetch(`${baseUrl}/riders`)

    .then(res => {
        if(res.ok) {
            return res.json()
        } else {
            throw new Error("Failed to fetch resource")
        }
    })

    .then(data => {
        data.map((rider) => {     //Array iteration to get a single item
            addRiders(rider)
        })
    })
}

getRiders()   //Call the function

//END OF GET REQUEST CODE BLOCK


//Customizing and Appending Cards to Display Rider Details 

function addRiders(rider) {                        
    let listRider = document.querySelector("#rider_list");
    let card = document.createElement("li");
    card.className = "card col-2 m-2";
    card.dataset.riderId = rider.id; // Add dataset attribute for rider ID
    card.innerHTML = `
        <img src=${rider.profilephoto} class="card-img-top" alt=${rider.ridername}>
        <div class="card-body">
            <h5 class="card-title">${rider.ridername}</h5>
            <p class="card-text">${rider.bikeplate}<span style="font-weight: bold">Tel: ${rider.mobilenumber}</span></p>
            <button class="btn m-2" id="editButton_${rider.id}">Edit</button> <!-- Updated edit button ID -->
            <button class="btn" id="delete">Delete</button>
        </div>
    `
    listRider.append(card);

    //Configuring Edit Button for Updating Rider Values

    let editBtn = card.querySelector(`#editButton_${rider.id}`); //Select Edit Button by its id.--->Target 

    editBtn.addEventListener("click", (e) => {
        const riderId = card.dataset.riderId;
        const riderName = rider.ridername;
        const bikePlate = rider.bikeplate;
        const profilePhoto = rider.profilephoto;
        const riderAge = rider.age;
        const riderMobile = rider.mobile;
        const riderEmail = rider.email;
        const physicalAddress = rider.physicaladdress;

        // User updating data in database through Prompts

        const updatedName = prompt("Enter updated rider name:", riderName);
        const updatedPlate = prompt("Enter updated bike plate:", bikePlate);
        const updatedProfilePhoto = prompt("Enter updated profile photo", profilePhoto);
        const updatedAge = prompt("Enter updated age:", riderAge);
        const updatedMobile = prompt("Enter updated mobile number:", riderMobile)
        const updatedEmail = prompt("Enter updated email:", riderEmail);
        const updatePysicalAddress=prompt("Enter updated pyhsical address", physicalAddress);


        // Updates from Prompts from the Previous code block
        const updatedData = {
            ridername: updatedName,
            bikeplate: updatedPlate,
            profilephoto: updatedProfilePhoto,
            age: updatedAge,
            mobilenumber: updatedMobile,
            email: updatedEmail,
            updatePysicalAddress
        };

        updateRider(riderId, updatedData);   //Call updateRider function with rider ID and updated data
    });

    let deleteBtn = card.querySelector("#delete");

    deleteBtn.addEventListener("click", (e) => {
        
        fetch(`${baseUrl}/riders/${rider.id}`, {
            
            method: "DELETE",
            
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.ok) {
                alert("delete approved!");
            }
        });
        e.target.parentNode.parentNode.remove();
    });
}

// 3. PATCH REQUEST SECTION (PATCH /riders/id) -->(UPATE OPERATION)


//Function to Update Rider Values

function updateRider(riderId, updatedData) {

    fetch(`${baseUrl}/riders/${riderId}`, {

        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(res => {

        if (res.ok) {

            return res.json();

        } else {
            throw new Error("Failed to update rider information");
        }
    })
    .then(data => {            // Optionally handle the updated data
        console.log("Rider information updated:", data);
        const card = document.querySelector(`[data-rider-id="${riderId}"]`);
        card.querySelector(".card-title").textContent = data.ridername;
        card.querySelector(".card-text").textContent = data.bikeplate + '<span style="font-weight: bold">Tel: ' + data.mobilenumber + '</span>';
    })
    .catch(err => {
        console.error("Error updating rider information:", err);
    });
}



// SEARCH FUNCTIONALITY CODE (Filters through the cards i.e Rider Data)

const searchInput = document.querySelector('input[type="search"]');
const searchButton = document.querySelector('button[type="submit"]');
const riderList = document.getElementById('rider_list');

searchButton.addEventListener('click', function(event) {
    event.preventDefault(); 

    const searchTerm = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
      const riderName = card.querySelector('.card-title').textContent.toLowerCase();
      const bikePlate = card.querySelector('.card-text').textContent.toLowerCase();

      if (riderName.includes(searchTerm) || bikePlate.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
});
