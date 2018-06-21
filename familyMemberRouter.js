const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {FamilyMember} = require('./models');
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  FamilyMember
    .find()
    .then(familyMembers => {
      console.log(familyMembers);
      res.json(familyMembers.map(familyMember => familyMember.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});


router.get('/:id', (req, res) => {
  FamilyMember
    .findById(req.params.id)
    .then(familyMember => res.json(familyMember.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});


router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['name', 'relation', 'birthday', 'photo_url'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  FamilyMember
    .create({
      name: req.body.name,
      relation: req.body.relation,
      birthday: req.body.birthday,
      photo_url: req.body.photo_url
    })
    .then(console.log(FamilyMember))
    .then(FamilyMember => res.status(201).json(FamilyMember.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


router.delete('/:id', (req, res) => {
  FamilyMember
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});


router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'relation', 'age', 'birthday', 'significant_other', 'anniversary', 'notes', 'photo_url'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  FamilyMember
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedFamilyMember => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


module.exports = router;
