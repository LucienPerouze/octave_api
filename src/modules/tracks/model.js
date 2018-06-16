import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const schema = Schema({
    name: { type: String, default: null },
    artist: { type: String, default: null },
    thumb: { type: String, default: null },
    session: { type: Schema.Types.ObjectId, ref: 'Session', autopopulate: true },
    playlist: { type: Schema.Types.ObjectId, ref: 'Playlist', autopopulate: true },
    service: { type: String, default: null },
    uri: { type: String, default: null },
    playing: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    cursor: { type: Number, default: 0 },
    creation: { type: Date, default: Date.now },
    last_update: { type: Date, default: Date.now },
});

schema.plugin(autopopulate);

schema.loadClass(class Track {

    serialize() {
        return new Promise((resolve, reject) => {

            let { _id, __v, session, playlist, ...track } = this.toObject();

            this.session.serialize()
                .then(session => {
                    resolve({
                        ...track,
                        id: _id,
                        addedBy: session,
                        test: this.session.last_fetch
                    });

                })
                .catch(e => reject(e));

        });
    }

});

export default mongoose.model('Track', schema);