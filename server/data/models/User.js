var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption'),
    Schema = mongoose.Schema;

module.exports.init = function () {
    var userSchema = new mongoose.Schema({
        username: {type: String, require: '{PATH} is required', unique: true},
        salt: String,
        hashPass: String,
        points: Number,
        postedProducts:[{type: Schema.Types.ObjectId, ref: 'Products'}],
        roles: [{type: String}]

    });

    userSchema.method({
        authenticate: function (password) {
            if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
                return true;
            }
            else {
                return false;
            }
        }
    });

    var User = mongoose.model('User', userSchema);
    User.find({}).exec(function (err, collection) {
        if (err) {
            console.log('Cannot find users: ' + err);
            return;
        }

        if (collection.length === 0) {
            var salt;
            var hashedPwd;

            salt = encryption.generateSalt();
            hashedPwd = encryption.generateHashedPassword(salt, 'Ivaylo');
            User.create({
                username: 'ivaylo.kenov',
                email: 'ivaylo@gmail.com',
                salt: salt,
                hashPass: hashedPwd,
                roles: ['admin']
            });
            salt = encryption.generateSalt();
            hashedPwd = encryption.generateHashedPassword(salt, 'Nikolay');
            User.create({
                username: 'Nikolay.IT',
                email: 'nikolay@gmail.com',
                salt: salt,
                hashPass: hashedPwd,
                roles: ['standard']
            });
            salt = encryption.generateSalt();
            hashedPwd = encryption.generateHashedPassword(salt, 'Doncho');
            User.create({username: 'Doncho', email: 'doncho@gmail.com', salt: salt, hashPass: hashedPwd});
            console.log('Users added to database...');
        }
    });
}


