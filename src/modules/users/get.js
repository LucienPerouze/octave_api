
export default (req, res, user, next) => {
    console.log(user);
    res.json({
        message: "Hello World!"
    });
}