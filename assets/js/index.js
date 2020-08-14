var dataRef = document.getElementById('datafield');
var yearRef = document.getElementById('yearfield');
var filteredData = [];
var groupedData = {};

// Main function for processing the data and doing the required calculations to give the final output as an object grouped by day
function processData(dt, yr) {
    try {
        let dataObj = JSON.parse(dt.value);
        let year = yr.value;
        if (year == '') {
            alert('Year is Blank!!!');
            return false;
        }
        dataObj.forEach(element => {
            let dateObj = new Date(element.birthday);
            if (dateObj.getFullYear() == year) {
                element.day = dateObj.getDay();
                element.initials = getInitials(element.name);
                filteredData.push(element);
            }
        });
        sortByAge(filteredData);
        groupByDay(filteredData, 'day');
        return true;
    } catch (error) {
        console.log(error);
        alert("Invalid Data!!!");
    }
}

// Function to sort the given array object by date youngest to oldest
function sortByAge(objArr) {
    objArr.sort(function(a, b) {
        let dateA = new Date(a.birthday);
        let dateB = new Date(b.birthday);
        return dateB - dateA;
    })
}

// Function to return the initials of a string
function getInitials(name) {
    let initialsArr = name.split(" ");
    let arrLen = initialsArr.length;
    let nameInitials = '';
    if (arrLen > 1) {
        nameInitials = initialsArr[0].charAt(0) + initialsArr[arrLen - 1].charAt(0);
    } else {
        nameInitials = initialsArr[0].charAt(0);
    }

    return nameInitials;
}

// Function to group the given object array by a property (Here day number)
function groupByDay(objArr, prop) {
    return objArr.reduce(function(acc, currObj) {
        let key = currObj[prop];
        if (acc[key] == undefined) {
            acc[key] = [];
        }
        acc[key].push(currObj);
        return acc;
    }, groupedData);
}

// Function to add or remove the blank card class
function blankCard(action) {
    if (action === 'remove') {
        for (let i = 0; i < document.getElementsByClassName('card-item').length; i++) {
            document.getElementsByClassName('card-item')[i].classList.remove('blank');
        }
    } else if (action === 'add') {
        for (let i = 0; i < document.getElementsByClassName('card-item').length; i++) {
            if (document.getElementsByClassName('card-item')[i].querySelectorAll('.name-tile').length == 0) {
                document.getElementsByClassName('card-item')[i].classList.add('blank');
            }
        }
    }
}

// Function to render the final UI
function uiRender() {
    for (const key in groupedData) {
        let arrLen = groupedData[key].length;
        let cardCount = Math.ceil(Math.sqrt(arrLen));
        groupedData[key].forEach(element => {
            let bdayPerson = document.createElement('span');
            let trgtEle = document.getElementsByClassName('card-item')[key];
            bdayPerson.innerHTML = element.initials;
            bdayPerson.classList.add('name-tile');
            bdayPerson.style.width = 100 / cardCount + '%';
            bdayPerson.style.height = 100 / cardCount + '%';
            bdayPerson.style.backgroundColor = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")";
            trgtEle.querySelectorAll('.card-body')[0].append(bdayPerson);
        });
    }
}



document.getElementById('updatebtn').addEventListener('click', function() {
    let cardItem = document.querySelectorAll('.name-tile');
    cardItem.forEach(function(ele) {
        ele.remove();
    })
    groupedData = {};
    filteredData = [];
    blankCard('remove');
    let dataRes = processData(dataRef, yearRef);
    if (dataRes == true) {
        uiRender();
        blankCard('add');
    }
})