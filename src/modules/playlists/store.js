import Playlist from './model';

export const fetchOne = _id => {
    return new Promise((resolve, reject) => {
        Playlist.findOne({ _id }, (e, playlist) => {
            if (e) reject(e);
            else resolve(playlist);
        })
    });
};

export const fetchOneByToken = token => {
    return new Promise((resolve, reject) => {
        Playlist.findOne({ token }, (e, playlist) => {
            if (e) reject(e);
            else resolve(playlist);
        })
    });
};

const generateToken = len => {
    const tokenMaterial = "abcdefghijklmnopqrstuvwxyz0123456789";
    let token = '';
    for (let i = 0; i < len; ++i)
        token += tokenMaterial.charAt(Math.floor(Math.random() * tokenMaterial.length));
    return token;
};

export const generateUniqueToken = () => {
    return new Promise(async resolve => {
        let token = generateToken(5);
        while (await fetchOneByToken(token))
            token = generateToken(5);
        resolve(token);
    });
};

export const create = (moderator, name = null) => {
    return new Promise(async (resolve, reject) => {
        const token = await generateUniqueToken(5);
        const playlist = new Playlist({
            moderator,
            name,
            token
        });
        playlist.save((e, playlist) => {
            if (e) reject(e.errors);
            resolve(playlist);
        });
    });
};