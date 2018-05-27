import { Tracks } from '../tracks';

export const fullPlaylist = async (req, res, session, next) => {

    if (!session)
        return res.json({error: 'You must be connected'});

    try {

        const tracks = await Tracks.fetchByPlaylist(session.playlist);

        session.updateLastFetch();

        res.json({
            tracks: await Promise.all(tracks.map(track => track.serialize())),
            total: tracks.length
        });

    } catch (error) {
        res.json({error});
    }

};

export const lastUpdates = async (req, res, session, next) => {

    if (!session)
        return res.json({error: 'You must be connected'});

    try {

        const tracks = await Tracks.fetchLastUpdates(session);

        session.updateLastFetch();

        res.json({
            tracks: await Promise.all(tracks.map(track => track.serialize())),
            total: tracks.length
        });

    } catch (error) {
        res.json({error});
    }

};