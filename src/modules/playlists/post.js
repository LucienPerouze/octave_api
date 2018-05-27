import { Users } from '../users';
import { Playlists } from '../playlists';
import { Sessions } from '../sessions';

const moment = require('moment');

export const create = async (req, res, session, next) => {

    if (!req.hasOwnProperty('body') || !req.body.device_uid)
        return res.json({error: 'Missing parameters'});

    const { device_uid, name } = req.body;

    try {

        const moderator = await Users.create(device_uid);
        const playlist = await Playlists.create(moderator, name ? name : null);
        const bearer_token = await Sessions.create(moderator, playlist, moment().add(5, 'months'), true); // Valid 5 months

        res.json({
            bearer_token,
            playlist: await playlist.serialize()
        });

    } catch (error) {
        res.json({error});
    }

};

export const join = async (req, res, session, next) => {

    if (!req.hasOwnProperty('body') || !req.body.device_uid || !req.body.playlist_token)
        return res.json({error: 'Missing parameters'});

    const { device_uid, playlist_token } = req.body;

    try {

        const playlist = await Playlists.fetchOneByToken(playlist_token);

        if (!playlist)
            return res.json({error: 'Playlist not found'});

        const user = await Users.create(device_uid);
        const bearer_token = await Sessions.create(user, playlist, moment().add(3, 'months')); // Valid 3 months

        res.json({
            bearer_token,
            playlist: await playlist.serialize()
        });

    } catch (error) {
        res.json({error});
    }

};