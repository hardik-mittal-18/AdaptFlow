import { UserCheck, Store, Wrench, ShieldCheck } from 'lucide-react';

export const ROLES = {
  CONSUMER: 'consumer',
  VENDOR: 'vendor',
  STAFF: 'staff',
  ADMIN: 'admin',
};

export const ROLE_CONFIG = {
  [ROLES.CONSUMER]: {
    id: ROLES.CONSUMER,
    label: 'Consumer',
    title: 'Consumer & Business User',
    description: 'Score customer churn predictions, explore telemetry insights, and submit verified feedback.',
    icon: UserCheck,
    badgeColor: 'primary',
    redirectPath: '/dashboard',
    isPublic: true,
    extraFields: []
  },
  [ROLES.VENDOR]: {
    id: ROLES.VENDOR,
    label: 'Vendor',
    title: 'Model & Data Vendor',
    description: 'Upload certified training datasets, license custom model weights, and monitor pipeline integration.',
    icon: Store,
    badgeColor: 'warning',
    redirectPath: '/vendor',
    isPublic: true,
    extraFields: [
      {
        name: 'business_name',
        label: 'Company / Business Name',
        placeholder: 'e.g. Apex Analytics Corp',
        required: true
      }
    ]
  },
  [ROLES.STAFF]: {
    id: ROLES.STAFF,
    label: 'Staff / Engineer',
    title: 'MLOps Staff Engineer',
    description: 'Investigate statistical data drift, inspect retraining cross-validation loss, and manage DVC commits.',
    icon: Wrench,
    badgeColor: 'success',
    redirectPath: '/staff',
    isPublic: true,
    extraFields: [
      {
        name: 'department',
        label: 'Engineering Department / Team',
        placeholder: 'e.g. MLOps & Production Reliability',
        required: true
      }
    ]
  },
  [ROLES.ADMIN]: {
    id: ROLES.ADMIN,
    label: 'Super Admin',
    title: 'Enterprise Platform Admin',
    description: 'Full governance, model approval/rejection, blue-green deployment gates, RBAC, and audit logs.',
    icon: ShieldCheck,
    badgeColor: 'purple',
    redirectPath: '/admin',
    isPublic: false,
    extraFields: [
      {
        name: 'admin_invite_code',
        label: 'Secret Admin Invite Code',
        placeholder: 'Enter authorized administrative passphrase',
        required: true,
        type: 'password'
      }
    ]
  }
};

export const PUBLIC_ROLES = Object.values(ROLE_CONFIG).filter((r) => r.isPublic);

export const DEFAULT_ROLE = ROLES.CONSUMER;

export const getRoleRedirect = (role) => {
  return ROLE_CONFIG[role]?.redirectPath || '/dashboard';
};
