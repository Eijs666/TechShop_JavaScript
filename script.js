//Bank html ids
const balance = document.getElementById("bank-balance");
const loanButton = document.getElementById("get-loan");
const loanStatus = document.getElementById("loan-status");
const outstandingLoanElement = document.getElementById("outstanding-loan");

// Work html ids
const payBalanceElement = document.getElementById("pay-balance");
const bankButton = document.getElementById("bank-button");
const workButton = document.getElementById("work-button");
const repayLoanButton = document.getElementById("pay-back-loan");

//Laptop html  Ids
const laptopDropdown = document.getElementById("laptop-dropdown");
const laptopSpecs = document.getElementById("laptop-specs");
const laptopName = document.getElementById("laptop-name");
const laptopDescription = document.getElementById("laptop-description");
const laptopPrice = document.getElementById("laptop-price");
const laptopImage = document.getElementById("laptop-image");
const buyLaptopButton = document.getElementById("buy-laptop");

//Variables
var outstandingLoan = 0;
var balanceAmount =  200;
var loanIsTaken = false;
var payBalance = 0;
var bankBalance = 200;


//Work functionality

// Variables

// Work - work Button
workButton.addEventListener("click", workButtonFunction);

//WORK - bank Button
bankButton.addEventListener("click", bankButtonFunction);

// Work - repay loan button
repayLoanButton.addEventListener("click", repayLoanButtonFunction);


function workButtonFunction(){
    payBalance += 100;
    updateNumbers()}

function bankButtonFunction(){
    balanceAmount += payBalance;
    payBalance = 0;

    //Function to update update html number elements
    updateNumbers();
}
//Button for repay loan
function repayLoanButtonFunction(){
    if (outstandingLoan > 0) {
        outstandingLoan -= payBalance;
        if (outstandingLoan < 0) {
            balanceAmount += Math.abs(outstandingLoan);
            outstandingLoan = 0;
        }
        payBalance = 0;

      //refresh html componenets
      //Function to update html number elements
      updateNumbers();

    }
}


//Udpate html bank balance
function updateNumbers() {
    balance.textContent = "balance: " + bankBalance + " Kr.";
    payBalanceElement.textContent = "Pay: " + payBalance + " kr.";
    outstandingLoanElement.textContent = "Outstanding loan: " + outstandingLoan + " Kr.";

    console.log(bankBalance)
}


//Get first pc image and info using async await

const firstPcImage = "https://hickory-quilled-actress.glitch.me/assets/images/1.png";

const getFirstPc = async (firstPcImage) => {
    //blob method so we can use the raw image file
    try {
        const response = await fetch(firstPcImage);
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        const imageElement = document.getElementById("laptop-image");
        imageElement.src = imageUrl;

    } catch (error) {
        console.log(error);
    }
};

getFirstPc(firstPcImage);


//Payback function
function payBackLoan() {
    if (outstandingLoan > 0) {
        balanceAmount -= outstandingLoan;
        outstandingLoan = 0;
        balance.textContent = "Bank balance: " + balanceAmount + " Kr.";
        updateNumbers()
    }
}

function setLoanStatus(){
    if(loanIsTaken == true){
        loanStatus.textContent = "loan is taken";
    }
    if(loanIsTaken == false){
        loanStatus.textContent = "loan is not taken";
    }
};

//Get loan
function getLoan() {
    //Is loan taken?
    if (loanIsTaken) {
        window.alert("Maximum 1 loan at a time");
        return; 
    }
    //Display the pop up prompt
    const inputLoanAmount = prompt('Please enter loan amount');

    //If nothing is entered
    if (inputLoanAmount === "") {
        alert("Enter a loan amount!");
        return; 
    }

    //From string to int conversion
    let loanAmount = parseInt(inputLoanAmount); 

    //Cant take double amount of bankbalance
    if (loanAmount > balanceAmount * 2) {
        window.alert("You cant take a loan greater than " + (balanceAmount * 2));
    } else {
        loanIsTaken = true;
        setLoanStatus()
        outstandingLoan = loanAmount;
        balanceAmount += loanAmount;
        balance.textContent = "Bank balance: " + balanceAmount + " Kr.";
        updateLoanStatus(true);
        console.log(balanceAmount);
    }
}

//Button listen for event
loanButton.addEventListener("click", getLoan);

//Buy laptop button Function - we call it In the fetch function


//Laptops - Fetch laptops api
fetch('https://hickory-quilled-actress.glitch.me/computers', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
.then(response => response.json())
.then(data => {
    console.log(JSON.stringify(data));

    //Fiil In drop down menu and specs
    data.forEach(laptop => {
        const option = document.createElement("option");
        option.value = laptop.id;
        option.text = laptop.title;
        laptopDropdown.appendChild(option);
    });

    //Pick a laptop - listen for Changes!
    laptopDropdown.addEventListener("change", function() 
    {
        let pickedLaptop;
        const pickedLaptopId = parseInt(this.value);
        
        //fix pickedLaptop - go through array and match id
        data.forEach(function(laptop){
            if(laptop.id === pickedLaptopId){
                pickedLaptop = laptop
            }
        })
        
        //IF changes occuor in the dropdown menu. Find id of laptop.
        //Change, create and append html elements to the picked id laptop
        if (pickedLaptop) {
            //Change html to display the picked laptops information
            laptopName.textContent = pickedLaptop.title;
            laptopDescription.textContent = pickedLaptop.description;
            laptopPrice.textContent = "Price: " + pickedLaptop.price + " kr.";

            //Combine base URL with image path
            const imagePath = 'https://hickory-quilled-actress.glitch.me/' + pickedLaptop.image;
            laptopImage.src = imagePath;

            laptopSpecs.innerHTML = ""; //Clear previous messages

            //Create new specs list for the picked laptop - in bullet point / list
            const specsList = document.createElement("ul");
            pickedLaptop.specs.forEach(spec => {
                const specItem = document.createElement("li");
                specItem.textContent = spec;
                specsList.appendChild(specItem);
            });
            laptopSpecs.appendChild(specsList);

            //Buy laptop button Function
            buyLaptopButton.addEventListener("click", function(){
                if (balanceAmount >= pickedLaptop.price) {
                    balanceAmount -= pickedLaptop.price;
                    balance.textContent = "Bank balance: " + balanceAmount + " Kr.";
                    message.textContent = "Congratulations! You bought a new laptop!";
                } else {
                    message.textContent = "You dont have enough money";
                }
            });
        }
    });


});
