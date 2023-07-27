const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(403);
        const rolesArray = [...allowedRoles];
        console.log('Required Role: ', rolesArray);
        console.log('Your Role: ', req.roles);

        // if any of the roles in req.roles is in rolesArray, return true
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true); 
        if (!result) return res.status(401).json({ 'message': '401: You do not have permissions to perform this operation'});
        next();
    }
}

module.exports = verifyRoles;