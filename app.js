// build express app
const express = require("express");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

const app = express();

app.use(jsonParser);

const PORT = process.env.PORT || 3000;

let identifiers = [];
let users = [];

// First Exercise

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

app.get("/patients/identifier", (req, res) => {
    let name = req.query.name;
    let dob = req.query.dob;
    let gender = req.query.gender;
    let idendtity = identifierCreator(name, dob, gender);

    /*
    Response: (200 OK)
    */
    users.push({
        name,
        dob,
        gender,
        idendtity,
    });
    res.send({ identifier: idendtity });
});
// ------- End of First Exercise

// Second Exercise
app.post("/identity", (req, res) => {
    /*
    Response:

        200 OK { } (empty body) -> If format matches and was successfully saved

        500    { error: <error message>} -> when an error happened storing the value

        409    { error: The record already exists} -> when the identifier already exists

    JSON.stringify(req.body) -> { "identifier": "ABCD1234A" }
    */
    // identifier format is cccciiiic
    // c = character
    // i = integer
    console.log(req.body);
    let identifier = req.body.identifier;

    // check if identifier is valid
    // valid regex is ^[A-Z]{4}[0-9]{4}[A-Z]{1}$
    if (
        identifier.length !== 9 ||
        !identifier.match(/^[A-Z]{4}[0-9]{4}[A-Z]{1}$/)
    ) {

        res.status(500).send({ error: "Invalid identifier" });
        return ;
    }

    // check if identifier already exists
    if (identifiers.includes(identifier)) {
        res.status(409).send({ error: "The record already exists" });
        return;
    }
    // else save identifier and return 200
    identifiers.push(identifier);
    res.status(200).send({});
});

app.get("/identity", (req, res) => {
    const identifier = req.query.identifier;
    // get the identifier from the identifiers array
    const foundIdentifier = users.find((user) => user.idendtity === identifier);
    if (foundIdentifier) {
        res.status(200).send({
            name: foundIdentifier.name,
            dob: foundIdentifier.dob,
            gender: foundIdentifier.gender,
        });
    } else {
        res.status(404).send({ error: "Identifier not found" });
    }
});

// ------- End of Second Exercise

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;