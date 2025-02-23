import { CashuWallet } from '../components/CashuWallet';
import { useAuth } from '../hooks/useAuth';

export const NIP60 = () => {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="nip60-container">
        <h2>Please login to access NIP-60 features</h2>
      </div>
    );
  }

  return (
    <div className="nip60-container">
      <h2>NIP-60 Cashu Wallet</h2>
      <p className="nip60-description">
        This is a NIP-60 compatible Cashu wallet that allows you to:
      </p>
      <ul className="nip60-features">
        <li>Mint and receive Cashu tokens</li>
        <li>Send tokens to other users</li>
        <li>Pay Lightning invoices</li>
        <li>Backup and restore your tokens</li>
      </ul>
      <div className="nip60-wallet">
        <CashuWallet />
      </div>
    </div>
  );
}; 