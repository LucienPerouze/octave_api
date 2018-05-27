

export default (req, res, user, next) => {

    const { mail, password } = req.body;

    if (!mail || !password) return res.status(401).json({error: 'missing params'});

    UsersStore.getUserByMail(req.body.mail)
        .then((user) => {
            const password = sha256(req.body.password);
            if(user.password === password) {
                const payload = {id: user.id};
                const token = jwt.sign(payload, jwtOptions.secretOrKey);
                user.serialize(req.user)
                    .then(user => res.json({token, user}))
                    .catch(error => res.status(401).json(error));
            } else {
                return res.status(401).json({
                    password: {
                        kind: "password",
                        message: "Tu t'es chié dans ton mot de passe.",
                        name: "wrongPassword",
                        path: "password",
                        stringValue: req.body.password.toString(),
                        value: req.body.password
                    }});
            }
        })
        .catch(error => res.status(401).json(error));

    res.json({
        message: "Hello World!"
    });
}