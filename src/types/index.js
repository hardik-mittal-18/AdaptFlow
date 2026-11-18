/**
 * Data shapes and enumerations for AdaptFlow MLOps platform
 */
export const UserRoles = {
  SUPER_ADMIN: 'super_admin',
  ML_ENGINEER: 'ml_engineer',
  END_USER: 'end_user'
};

export const ModelStages = {
  PRODUCTION: 'Production',
  STAGING: 'Staging',
  VALIDATION: 'Validation',
  ARCHIVED: 'Archived'
};

export const DriftStatuses = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  CRITICAL: 'critical'
};

export default {
  UserRoles,
  ModelStages,
  DriftStatuses
};
