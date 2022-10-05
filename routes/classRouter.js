const express = require('express')
const router = express.Router();
const {Class} = require("../models/Class");

router.get('/',async (request, response) => {
    const classes =  await Class.find()
    response.render('pages/index.ejs', {classes});
});

router.get('/class', async (request, response) => {
    response.json(await Class.find());
})

router.post('/class', async (request, response) => {

    console.log('request body is ')
    console.table(request.body)
    const userClass = new Class({
        exam: request.body.exam,
        name: request.body.name,
        result: request.body.result,
    });
    await userClass.save()
    response.redirect(201, '/')
})


//use item ID for now in request to update the score of the Exam
router.put('/class/:classId', (request, response) => {

})

router.delete('/class/:classId', async (request, response) => {
    const classIdToDelete = request.params.classId;

    console.log('class if is ', classIdToDelete)
    const hi = await Class.findByIdAndRemove(classIdToDelete)

    console.log('found one ', hi)
    console.log(`Class ${classIdToDelete} was deleted`)
    response.redirect(304, '/')
})

module.exports = router