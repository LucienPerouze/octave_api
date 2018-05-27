import Track from './model';

export const fetchOne = _id => {
    return new Promise((resolve, reject) => {
        Track.findOne({ _id }, (e, track) => {
            if (e) reject(e);
            else resolve(track);
        })
    });
};

export const fetchByPlaylist = (playlist, limit = 0, offset = 0, order = 'creation', orderDirection = 1) => {
    return new Promise((resolve, reject) => {
        Track.find({playlist})
            .limit(limit)
            .skip(offset)
            .sort([[order, orderDirection]])
            .exec((err, tracks) => {
                if (err) reject(err);
                resolve(tracks);
            });
    });
};

export const fetchLastUpdates = (session, limit = 0, offset = 0, order = 'creation', orderDirection = 1) => {
    return new Promise((resolve, reject) => {
        Track.find({
            playlist: session.playlist,
            last_update: {$gt: session.last_fetch}
        })
            .limit(limit)
            .skip(offset)
            .sort([[order, orderDirection]])
            .exec((err, tracks) => {
                if (err) reject(err);
                resolve(tracks);
            });
    });
};

export const create = (session, service, uri) => {
    return new Promise((resolve, reject) => {
        const track = new Track({
            session,
            service,
            playlist: session.playlist,
            uri
        });
        track.save((e, track) => {
            if (e) reject(e.errors);
            resolve(track);
        });
    });
};

export const pause = playlist => {
    return new Promise((resolve, reject) => {
        Track.find({
            playlist,
            playing: true
        })
            .exec((err, tracks) => {
                if (err) reject(err);
                tracks.map(track => {
                    track.playing = false;
                    track.last_update = new Date();
                    track.save((e, track) => track);
                    return track;
                });
                resolve(tracks);
            });
    });
};

export const cursorToZero = playlist => {
    return new Promise((resolve, reject) => {
        Track.find({
            playlist,
            cursor: {$gt: 0}
        })
            .exec((err, tracks) => {
                if (err) reject(err);
                tracks.map(track => {
                    track.cursor = 0;
                    track.last_update = new Date();
                    track.save((e, track) => track);
                });
                resolve(tracks);
            });
    });
};

export const play = (track, cursor) => {
    return new Promise(async (resolve, reject) => {

        try {

            await pause(track.playlist);
            await cursorToZero(track.playlist);

            track.playing = true;
            track.cursor = cursor;
            track.last_update = new Date();

            track.save((e, track) => {
                if (e) reject(e.errors);
                resolve(track);
            });

        } catch (e) {
            reject(e);
        }

    });
};