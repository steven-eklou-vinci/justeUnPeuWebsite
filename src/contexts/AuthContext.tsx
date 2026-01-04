// FICHIER OBSOLETE - Nous utilisons MongoDB, pas Supabase
// L'authentification se fait maintenant via le hook useAuth dans /hooks/useAuth.ts

// Provider vide pour maintenir la compatibilité
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Ré-exporter useAuth depuis le hook pour maintenir la compatibilité
export { useAuth } from '@/hooks/useAuth';

export default AuthProvider;