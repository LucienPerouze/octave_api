import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const schema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    playlist: { type: Schema.Types.ObjectId, ref: 'Playlist', autopopulate: true },
    isModerator: { type: Boolean, default: false },
    creation: { type: Date, default: Date.now },
    last_fetch: { type: Date, default: Date.now },
    expiration: { type: Date, default: Date.now },
});

schema.plugin(autopopulate);

schema.loadClass(class Session {

    serialize() {
        return new Promise((resolve, reject) => {

            let { _id, __v, user, playlist, last_fetch, ...session } = this.toObject();

            this.user.serialize()
                .then(user => {
                    resolve({
                        ...session,
                        id: _id,
                        profile: user,
                    });

                })
                .catch(e => reject(e));

        });
    }

    updateLastFetch() {
        this.last_fetch = new Date();
        this.save();
    }

});

export default mongoose.model('Session', schema);