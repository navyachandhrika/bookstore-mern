/**
 * middleware/admin.js - Role-based admin access middleware.
 * Must be used AFTER the auth middleware so req.user is populated.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Access forbidden: Admins only.' });
};

export default admin;
