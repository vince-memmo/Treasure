# Treasure
[Click here to view!](https://treasure-mhx1.onrender.com/)
<br>

## Background
Scavenger hunts are a popular form of entertainment, common in settings ranging from simple birthday parties to corporate team-building events to highly-organized clubs such as the [Hash house Harriers](https://en.wikipedia.org/wiki/Hash_House_Harriers). Treasure is a a MERN-stack web application which enables users to create, share and participate in digitally-enhanced scavenger hunts. The web app helps in the planning and creation of events, the distribution and organization of event information, and the tracking of participant's location and game status as they proceed along the game course. It leverages GPS location fetches, an intricate backend data structure, and a user-friendly interface to take the difficulty out of the planning and participation. Easily construct a connected set of event points on the map, create and trigger event clues upon participants' arrival, organize the needed supplies and costs, and share your event with the public or your community. During the event, track participants' locations and which events they have completed and automatically share with them important information at appropriate times.

Treasure is designed to be as flexible: Events can be a complex series of mini-games with clues and required responses, or they can simply by a series of GPS locations on a map, each revealed upon a participant's arrival at the former. These events can be published, shared, and replayed by other users long after the original event has occurred, allowing for great scavenger hunt game designs to be appreciated by a larger audience and for events to be created without having to plan them from scratch.

![image](https://user-images.githubusercontent.com/110148438/207213514-23171777-f3f5-4f08-a56d-b93c315e0f2d.png)
<br>

## Tech Stack
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
<br>
<br>

## Features
### User Authentication - Login/Signup
Treasure user authetntication allows user to create an account or login, either with their own account or as a demo user. Login is required before user is able to browse around the app. 

![Sign Up](https://user-images.githubusercontent.com/110148438/207214377-37934169-4f77-457e-8de2-6adce70e2a16.png)
<br>

### Event Planning
Logged in users can create, read, update, and delete their own events. An interactive map will be shown so users are able to create their own route and create each details in each points. Total distance, elevation gain, and estimated event duration will be automatically updated according to the user input.

![create_event](https://s9.gifyu.com/images/create_event47c6d01a4d76800d.gif)

Code Snippet: Find address of the first pin of the map 
```
const geocoder = new window.google.maps.Geocoder();

let address = await geocoder.geocode({location: firstPin.location});
if (address.results[0]) {
  address = address.results[0].formatted_address;
} else {
  address = "Location Unavailable"
};
```

### Server-side Error Handling

Error handling on the backend is handled with express-validator. When a request is sent to one of the backend routes,e.g. POST pins, all the parameters are ran through ```validatePinInput```

```
router.post('/:eventId', requireUser, validatePinInput, async (req, res, next) => {
    try {
        const dupPins = await Pin.find({event: req.params.eventId})

        Object.values(dupPins).forEach((dupPin) => {
            if (`${dupPin.order}` === req.body.order && `${dupPin.order}`) {
                throw next(error);
            }
        })
```

Once all the parameters are checked, all the errors are sent to ```handleValidationErrors```

```
# Pins Validations

const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validatePinInput = [
  check('location')
    .exists({ checkFalsy: true })
    .isLength(2)
    .withMessage('Location must have two values'),
  check('task')
    .isLength({ max: 1000 })
    .withMessage('Instructions must be less than 1000 characters'),
  check('supplies')
    .isLength({ max: 500 })
    .withMessage('Supplies must be less than 500 characters'),
  check('order')
    .exists({ checkFalsy: true })
    .withMessage('Pin must have an order'),
  check('directionToPin')
    .isLength({ min: 0, max: 500 })
    .exists({ checkFalsy: true })
    .withMessage('Directions must be less than 500 characters'),
  handleValidationErrors
];
```

If errors exist, a status "400" and the title "Validation Error" error is sent to the frontend.

```
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  
  if (!validationErrors.isEmpty()) {
    const errorFormatter = ({ msg }) => msg;
    const errors = validationErrors.formatWith(errorFormatter).mapped();

    const err = Error("Validation Error");
    err.errors = errors;
    err.statusCode = 400;
    err.title = "Validation Error";
    next(err);
  }
  next();
};
```

### Image Uploads

When creating an event, image uploads were sent as PATCH requests, after the initial POST request for creating the event was processed. This is due to the need to send the image as FormData, which cannot be put through the validation checks seen above. We instead did our validation checks of the image in the frontend, ensuring the image is a jpg, jpeg, for png. Once the image request was made, a call to ```imageUpload``` is made. If an image exists ```req.file.location``` is given to the image attribute. If no image exists (i.e. the user decided not to upload an image), a default url is given to the image attribute. 

```
#Event Controller

router.patch('/addImage/:eventId', validateEventInput, async (req, res, next) => {
    const eventId = req.params.eventId
    let photoUrl
    imageUpload.single("images")(req, res, async function (err) {
    if(!req.file){
        photoUrl = 'https://treasure-photos.s3.us-west-1.amazonaws.com/1669765988351'
    } else{
        photoUrl = await req.file.location
    }

    Event.findByIdAndUpdate((eventId), {image: photoUrl})
    .exec()
    .then((event) => {
        if(!event) {
            res.status(400).send(`Id ${req.params.id} was not found`);
        } else {
            res.status(200).send(`Id ${req.params.id} was updated`)
        }
    }) 
    })
});
```

The actual uploading of the image to AWS S3 uses the node.js middle ware multer. Please note, the following function is exported as  ```upload```, but imported as ```imageUpload``` in events controller. 

```
const upload = multer({
    fileFilter,
    storage: multerS3({
      acl: "public-read",
      s3,
      bucket: 'treasure-photos',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: "TESTING_METADATA" });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString());
      },
    }),
  });

  module.exports = upload;
```
