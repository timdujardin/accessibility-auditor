export interface UserProfileCardProps {
  fullName?: string;
  email?: string;
  isAdmin: boolean;
  onSignOut: () => void;
}
