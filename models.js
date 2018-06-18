'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const familyMemberSchema = mongoose.Schema({
    name: {type: String, required: true},
    relation: {type: String, required: true},
    birthday: {type: Date, required: true},
    significant_other: {type: String, required: false},
    anniversary: {type: Date, required: false},
    notes: {type: String, required: false},
    photo_url: {type: String, required: true}
  }
)

//virtual property for Age

familyMemberSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this._name,
    relation: this._relation,
    age: this._age,
    birthday: this._birthday,
    significant_other: this._significant_other,
    anniversary: this._anniversary,
    notes: this._notes,
    photo_url: this._url
  }
}

const FamilyMember =  mongoose.model('FamilyMember', familyMemberSchema);

module.exports = {FamilyMember};
