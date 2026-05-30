import { Response, NextFunction } from 'express';
import { AuthedRequest, Tier } from '../types';

const RANK: Record<Tier, number> = { free: 0, pro: 1, alpha: 2 };

/**
 * Gate a route behind a minimum tier. Example: requireTier('pro').
 */
export function requireTier(min: Tier) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    const tier = req.user?.tier ?? 'free';
    if (RANK[tier] < RANK[min]) {
      res.status(403).json({
        error: 'upgrade_required',
        message: `This feature requires the ${min} plan.`,
        current_tier: tier,
        required_tier: min,
      });
      return;
    }
    next();
  };
}
