import jwt from 'jsonwebtoken';

import Session from './model';

export const fetchOne = (_id) => {
    return new Promise((resolve, reject) => {
        Session.findOne({ _id }, (e, session) => {
            if (e) reject(e);
            else resolve(session);
        })
    });
};

export const create = (user, playlist, expiration, isModerator = false) => {
    return new Promise((resolve, reject) => {
        const session = new Session({
            user,
            playlist,
            expiration,
            isModerator
        });
        session.save((e, session) => {
            if (e) reject(e.errors);
            resolve(jwt.sign({id: session._id}, process.env.PASSPORT_SECRET));
        });
    });
};