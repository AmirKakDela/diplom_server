module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') next();

    try {
        const token = req.headers.authorization;
        if (!token) if (!token) return res.status(403).json({message: 'Пустой токен'});
        const isAdmin = token.split('_')[1];
        if (isAdmin === 'true') {
            req.user = isAdmin;
            next();
        } else {
            return res.status(403).json({message: 'У данного пользователя нет доступа администратора'});
        }

    } catch (e) {
        console.log(e);
        return res.status(403).json({message: 'У данного пользователя нет доступа администратора', e});
    }
}