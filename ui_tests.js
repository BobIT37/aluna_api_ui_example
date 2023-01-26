const {By,Key,Builder} = require("selenium-webdriver");
require("chromedriver");
const assert = require('assert');

//identifier function for ui tests
const identifierCreator = (Name, dob, gender) => {
    // split all given names
    let nameSurname = Name.split(" ");
    // get first name first two letters and uppercase
    let name = nameSurname[0].substring(0, 2).toUpperCase();
    // get last name first two letters and uppercase
    let LastName = nameSurname[nameSurname.length - 1]
        .substring(0, 2)
        .toUpperCase();
    // get birth year
    let BirthYear = dob.split("-")[0];
    // get gender first letter and uppercase
    let Gender = gender.split("")[0].substring(0, 1).toUpperCase();

    // combine all and return
    return name + LastName + BirthYear + Gender;
};

//identifier
let identifier = identifierCreator("Juan Gomez", "1940-12-01", "Male");

//Patient found scenario
async function patientFound(){

    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser("chrome").build();

     //To fetch https://alunacare.com/ from the browser with our code. (url is only sample)
     await driver.get("https://alunacare.com/");

      //Verify the page title and print it that you are in correct page
      let title = await driver.getTitle();
      console.log('Title is:',title);
         
     //To send a search query by passing the value in identifier.
     await driver.findElement(By.id("searchBox")).sendKeys(identifier,Key.RETURN);
     //Click on Find patient button
     await driver.findElement(By.id("findPatient")).click();

     //Patient found scenario sample element examples
     let patientFound = await driver.findElement(By.xpath('//*[@id="patientFound"]/div/p')).getText();
     let name = await driver.findElement(By.xpath('//*[@id="name"]/div/p')).getText();
     let dob = await driver.findElement(By.xpath('//*[@id="dob"]/div/p')).getText();
     let gender = await driver.findElement(By.xpath('//*[@id="gender"]/div/p')).getText();

     //Verify correct patient and present in database
     assert.strictEqual(patientFound, "Patient Found");
     assert.strictEqual(name, "Juan Gomes");
     assert.strictEqual(dob, "1940-12-01");
     assert.strictEqual(gender, "Male");

     //It is always a safe practice to quit the browser after execution
     await driver.quit();

};

//sceond identifier for no patient example
let secondIdentifier = identifierCreator("ilhan turkmen", "1980-12-01", "Male");

//No patient example
async function patientNotFound(){
 
    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser("chrome").build();

     //To fetch https://alunacare.com/ from the browser with our code.
     await driver.get("https://alunacare.com/");

      //Verify the page title and print it
      var title = await driver.getTitle();
      console.log('Title is:',title);
         
     //To send a search query by passing the value in identifier.
     await driver.findElement(By.id("searchBox")).sendKeys(secondIdentifier,Key.RETURN);
     //Click on Find patient button
     await driver.findElement(By.id("findPatient")).click();

     //Patient not found scenario
     let noIdentifier = await driver.findElement(By.xpath('//*[@id="noPatient"]/div/p')).getText();

     try{
        assert.equal(noIdentifier, "No patient matches the identier")
     }catch(error){
        console.log("Error: ", error)
     }
     
     //It is always a safe practice to quit the browser after execution
     await driver.quit();

}