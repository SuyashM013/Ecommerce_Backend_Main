const mongoose = require('mongoose');
const {Schema } = mongoose;

const blacklistSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
});

//blacklistSchema.index({ token: 1 }, { unique: true });

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist;