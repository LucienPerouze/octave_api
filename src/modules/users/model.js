import mongoose, { Schema } from 'mongoose';

const schema = Schema({
    device_uid: { type: String, default: null },
    spotify_id: { type: String, default: null },
    deezer_id: { type: String, default: null },
    soundCloud_id: { type: String, default: null },
    creation: { type: Date, default: Date.now },
});

schema.loadClass(class User {

    serialize() {
        return new Promise((resolve, reject) => {

            let { _id, __v, device_uid, ...user } = this.toObject();

            resolve({
                ...user,
                id: _id
            });

        });
    }

});

export default mongoose.model('User', schema);