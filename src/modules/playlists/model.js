import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const schema = Schema({
    moderator: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    name: { type: String, default: null },
    token: { type: String, default: null },
    creation: { type: Date, default: Date.now },
});

schema.plugin(autopopulate);

schema.loadClass(class Playlist {

    serialize() {
        return new Promise((resolve, reject) => {

            let { _id, __v, moderator, ...playlist } = this.toObject();

            this.moderator.serialize()
                .then(moderator => {
                    resolve({
                        ...playlist,
                        id: _id,
                        moderator
                    });

                })
                .catch(e => reject(e));

        });
    }

});

export default mongoose.model('Playlist', schema);