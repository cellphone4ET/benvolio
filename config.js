exports.DATABASE_URL =  process.env.TEST_DATABASE_URL || 'mongodb://localhost/family-mash';
exports.TEST_DATABASE_URL =  process.env.TEST_DATABASE_URL || 'mongodb://localhost/family-mash-test';
exports.PORT = process.env.PORT || 8080;