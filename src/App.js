'use strict';

import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Sessions } from './modules/sessions';
import router from "./router";

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(passport.initialize());

passport.use(new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PASSPORT_SECRET
    }, ({ id }, next) => {
        Sessions.fetchOne(id)
            .then(session => {
                if (session.expiration < Date.now()) next('Expired token.', null);
                else next(null, session)
            })
            .catch(err => next(err, null));
    }
));

app.use('/', router);

try {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${process.env.MONGODB_USER || process.env.MONGODB_PASS ? `${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@` : ""}${process.env.MONGODB_SERVER}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`)
        .then(db => app.listen(process.env.PORT || 8080, () => console.log(`[SUCCESS] ${process.env.MONGODB_NAME} listening on port ${process.env.PORT} ...`)));
} catch(e) {
    console.error(e.toString());
}