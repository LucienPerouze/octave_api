import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import multer from 'multer';
import { Playlists, Tracks } from './modules';

const router = express.Router();
const inputs = multer({ dest : './tmp'});
const session = false;

const handleRequest = (req, res, next, handler, err, session) => err ? res.json(err) : handler(req, res, session, next); // TODO: Handler errors
const get = (path, handler) => router.get(path, (req, res, next) => passport.authenticate('jwt', { session }, (err, session) => handleRequest(req, res, next, handler, err, session))(req, res, next, handler));
const post = (path, handler) => router.post(path, inputs.array(), (req, res, next) => passport.authenticate('jwt', { session }, (err, session) => handleRequest(req, res, next, handler, err, session))(req, res, next, handler));
const put = (path, handler) => router.put(path, inputs.array(), (req, res, next) => passport.authenticate('jwt', { session }, (err, session) => handleRequest(req, res, next, handler, err, session))(req, res, next, handler));

// Playlists
post('/playlists/create', Playlists.post.create);
post('/playlists/join', Playlists.post.join);

// Tracks
get('/tracks', Tracks.get.fullPlaylist);
get('/tracks/updates', Tracks.get.lastUpdates);
post('/tracks/add', Tracks.post.add);
put('/tracks/play', Tracks.put.play);
put('/tracks/pause', Tracks.put.pause);

export default router;