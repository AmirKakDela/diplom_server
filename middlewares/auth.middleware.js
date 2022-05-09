module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') next();
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(403).json({message: 'Пустой токен'});
        const userId = token.split('_')[0];
        // тут есть небольшая дыра, т.к. мы не используем jwt token
        // потому что миделвейр проверяет только само наличие токена, но не его корректность
        req.user = userId;
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: 'Пользователь не авторизован', e});
    }
}
