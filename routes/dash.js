const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const { search } = require('../routes/scrape');
const User = require('../models/User');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', async (req, res) => {
  return res.json({
    status: 1,
    data: {
      username: req.user.username,
      email: req.user.email,
      about: req.user.about || '',
      fName: req.user.fName || '',
      lName: req.user.lName || '',
      address: req.user.address || '',
      city: req.user.city || '',
      country: req.user.country || '',
      skills : req.user.skills || [],
      postalCode: req.user.postalCode || '',
      uni: req.user.uni || '',
      degree: req.user.degree || '',
      field: req.user.field || '',
    },
  });
});

router.post('/update', async (req, res) => {
  for (let key in req.body) {
    req.user[key] = req.body[key];
  }
  await req.user.save();
  res.json({ status: 1 });
});

router.post('/search', async (req, res) => {
  const query = req.body.query;
  const loc = req.user.country;
  console.log('request recieved! ' + query);
  search(
    query,
    (response) => {
      res.json({ data: response });
    },
    loc.length>0?loc:"India"
  );
});


router.get('/skill',(req,res)=>{
    res.json( {
      skills : req.user.skills
    })
});

module.exports = router;
