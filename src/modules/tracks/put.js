import { Tracks } from '../tracks';

export const play = async (req, res, session, next) => {

    if (!session)
        return res.json({error: 'You must be connected'});

    if (!req.hasOwnProperty('body') || !req.body.track_id)
        return res.json({error: 'Missing parameters'});

    const { track_id, cursor } = req.body;

    if (!session.isModerator)
        return res.json({error: "You're not moderator of the playlist"});

    try {

        const track = await Tracks.fetchOne(track_id);

        if (!track && !track.deleted)
            return res.json({error: 'Track not found in playlist'});

        const currentTrack = await Tracks.play(track, cursor && cursor > 0 ? cursor : 0);

        res.json({
            track: await currentTrack.serialize()
        });

    } catch (error) {
        res.json({error});
    }

};

export const pause = async (req, res, session, next) => {

    if (!session)
        return res.json({error: 'You must be connected'});

    if (!session.isModerator)
        return res.json({error: "You're not moderator of the playlist"});

    try {

        const pausedTracks = await Tracks.pause(session.playlist);

        res.json(pausedTracks);

    } catch (error) {
        res.json({error});
    }

};