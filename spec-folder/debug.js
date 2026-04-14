let myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (let i = 0; i < myArray.length; i++) {
  console.log(myArray[i]);
  debugger;
  if (myArray[i] === 5) {
    console.log("Found 5!");
    break;
  }
}
