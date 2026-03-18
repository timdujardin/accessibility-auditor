export interface ContactFormCardProps {
  ownerContactPhone: string;
  ownerContactEmail: string;
  ownerContactAddress: string;
  onContactChange: (data: {
    ownerContactPhone?: string;
    ownerContactEmail?: string;
    ownerContactAddress?: string;
  }) => void;
}
