export const isAuthenticated = (req, res, next) => {
    if (!req.session.user && !req.session.user.id) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    next();
};


// export const isAdmin = (req, res, next) => {
//     if (!req.session.user || req.session.user.role !== 'admin') {
//         return res.status(403).send('Access Denied: Admins only');
//     }
//     next();
// };


export const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only' });
    }
    next();
};




export const isCustomer = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'customer') {
        return res.status(403).send('Access Denied: Customers only');
    }
    next();
};
