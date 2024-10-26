import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    // Add other user fields if necessary, e.g., id, name, etc.
  };
}

const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
  // Check if user is authenticated and email matches the admin email
  if (req.user && req.user.email === 'admin@gmail.com') {
    return next(); // User is admin, allow access
  } else {
    return res.status(403).json({ message: 'Access denied, admin only' }); // Forbidden
  }
};

export default isAdmin;
