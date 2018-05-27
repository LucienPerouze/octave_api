import sha256 from "sha256";

import User from './model';

export const fetchOne = (_id) => {
    return new Promise((resolve, reject) => {
        User.findOne({ _id }, (e, user) => {
            if (e) reject(e);
            else resolve(user);
        })
    });
};

export const findOneByDeviceUid = (device_uid) => {
    return new Promise((resolve, reject) => {
        device_uid = sha256(device_uid);
        User.findOne({ device_uid }, (e, user) => {
            if (e) reject(e);
            else resolve(user);
        })
    });
};

export const create = (device_uid) => {
    return new Promise(async (resolve, reject) => {

        try {

            const alreadyExisting = await findOneByDeviceUid(device_uid);

            if (alreadyExisting) {
                return resolve(alreadyExisting);
            }

            const user = new User({
                device_uid: sha256(device_uid)
            });

            user.save((e, user) => {
                if (e) reject(e.errors);
                resolve(user);
            });

        } catch (e) {
            reject(e);
        }
    });
};