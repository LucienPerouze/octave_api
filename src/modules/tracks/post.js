import { Tracks } from '../tracks';

export const add = async (req, res, session, next) => {

    if (!session)
        return res.json({error: 'You must be connected'});

    if (!req.hasOwnProperty('body') || !req.body.service || !req.body.uri)
        return res.json({error: 'Missing parameters'});

    const { service, uri } = req.body;

    try {

        const track = await Tracks.create(session, service, uri);

        res.json({
            track: await track.serialize()
        });

    } catch (error) {
        res.json({error});
    }

};