const express = require('express')
const router = express.Router();
const { Ride } = require("../models/Ride");

router.get('/', async (request, response) => {
    const rides =  await Ride.find()
    response.render('pages/index.ejs', {rides});
});

router.get('/ride', async (request, response) => {
    response.json(await Ride.find());
})

router.post('/ride', async (request, response) => {


    console.log(`request body is: `)
    console.table(request.body)

    const userRide = new Ride({
      park: request.body.park,
      ride: request.body.ride,
      rating: request.body.rating,
    });

    await userRide.save()
    response.redirect(201, '/')
})


//use item ID for now in request to update the Ratings
router.put('/ride/:rideId', async (request, response) => {

    // COMMENT OUT IF CODE BREAKS
    const rideIdToUpdate = request.params.rideId;
    const rating = request.body.rating
    console.log('RIDE ID THAT IS UPDATED ', rideIdToUpdate)
    // await findByIdAndUpdate(rideIdToUpdate)

    
    await Ride.findOneAndUpdate(
        {_id: rideIdToUpdate },
      { rating: rating }
    );

    response.redirect(200, "/");
})

router.delete('/ride/:rideId', async (request, response) => {
    const rideIdToDelete = request.params.rideId;

    console.log('RIDE ID #: ', rideIdToDelete)
    const hi = await Ride.findByIdAndRemove(rideIdToDelete)

    console.log(`found one to delete ${hi}`)
    console.log(`Ride ${rideIdToDelete} was deleted`)
    response.redirect(304, '/')
})

module.exports = router