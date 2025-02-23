import { useState, useEffect, useMemo } from 'react';
import { CashuMint, CashuWallet as CashuSDK, MintQuoteState, getEncodedTokenV4 } from '@cashu/cashu-ts';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ndk } from '../utils/nostr';

const MINT_URL = 'https://legend.lnbits.com/cashu/api/v1/4gr9Xcmz3XEkUNwiBiQGoL'; // Example mint

export const CashuWallet = () => {
  const [balance, setBalance] = useState(0);
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mintAmount, setMintAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [meltInvoice, setMeltInvoice] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [receivedToken, setReceivedToken] = useState('');

  // Initialize Cashu wallet with useMemo
  const wallet = useMemo(() => {
    const mint = new CashuMint(MINT_URL);
    return new CashuSDK(mint);
  }, []);

  useEffect(() => {
    const initWallet = async () => {
      try {
        await wallet.loadMint();
        // Load stored proofs from localStorage
        const storedProofs = localStorage.getItem('cashuProofs');
        if (storedProofs) {
          const parsedProofs = JSON.parse(storedProofs);
          setProofs(parsedProofs);
          setBalance(parsedProofs.reduce((acc, proof) => acc + proof.amount, 0));
        }

        // Load transaction history
        const storedTxs = localStorage.getItem('cashuTransactions');
        if (storedTxs) {
          setTransactions(JSON.parse(storedTxs));
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing wallet:', err);
        setError('Failed to initialize wallet');
        setLoading(false);
      }
    };

    initWallet();
  }, [wallet]);

  const handleMint = async () => {
    try {
      const amount = parseInt(mintAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Create mint quote
      const mintQuote = await wallet.createMintQuote(amount);
      
      // Create NIP-60 quote event
      const quoteEvent = {
        kind: 7374,
        content: mintQuote.quote,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['expiration', (Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14).toString()], // 2 weeks
          ['mint', MINT_URL]
        ],
        pubkey: await window.nostr.getPublicKey()
      };

      const signedEvent = await window.nostr.signEvent(quoteEvent);
      const ndkEvent = new NDKEvent(ndk, signedEvent);
      await ndkEvent.publish();

      // Pay the invoice (this should be handled by your Lightning wallet)
      alert(`Please pay this Lightning invoice: ${mintQuote.request}`);

      // Check payment status
      const checkInterval = setInterval(async () => {
        const status = await wallet.checkMintQuote(mintQuote.quote);
        if (status.state === MintQuoteState.PAID) {
          clearInterval(checkInterval);
          const newProofs = await wallet.mintProofs(amount, mintQuote.quote);
          
          // Store proofs
          const updatedProofs = [...proofs, ...newProofs];
          localStorage.setItem('cashuProofs', JSON.stringify(updatedProofs));
          setProofs(updatedProofs);
          setBalance(balance + amount);
          setMintAmount('');
        }
      }, 5000);

      // Clear interval after 5 minutes
      setTimeout(() => clearInterval(checkInterval), 5 * 60 * 1000);
    } catch (err) {
      console.error('Error minting tokens:', err);
      setError('Failed to mint tokens');
    }
  };

  const handleSend = async () => {
    try {
      const amount = parseInt(sendAmount);
      if (isNaN(amount) || amount <= 0 || amount > balance) {
        throw new Error('Invalid amount');
      }

      // Split proofs for sending
      const { send: proofsToSend, keep: proofsToKeep } = await wallet.send(amount, proofs);
      
      // Create encoded token
      const token = getEncodedTokenV4({ token: [{ mint: MINT_URL, proofs: proofsToSend }] });

      // Create NIP-60 token event
      const tokenEvent = {
        kind: 7375,
        created_at: Math.floor(Date.now() / 1000),
        content: token,
        tags: [
          ['amount', amount.toString()],
          ['mint', MINT_URL]
        ],
        pubkey: await window.nostr.getPublicKey()
      };

      const signedEvent = await window.nostr.signEvent(tokenEvent);
      const ndkEvent = new NDKEvent(ndk, signedEvent);
      await ndkEvent.publish();

      // Update local state
      setProofs(proofsToKeep);
      localStorage.setItem('cashuProofs', JSON.stringify(proofsToKeep));
      setBalance(balance - amount);
      
      // Record transaction
      const tx = {
        type: 'send',
        amount,
        timestamp: Date.now(),
        token
      };
      const updatedTxs = [tx, ...transactions];
      setTransactions(updatedTxs);
      localStorage.setItem('cashuTransactions', JSON.stringify(updatedTxs));

      setSendAmount('');
      alert(`Token created! Share this token:\n\n${token}`);
    } catch (err) {
      console.error('Error sending tokens:', err);
      setError('Failed to send tokens');
    }
  };

  const handleReceive = async () => {
    try {
      if (!receivedToken) {
        throw new Error('No token provided');
      }

      // Receive the token
      const newProofs = await wallet.receive(receivedToken);
      const amount = newProofs.reduce((acc, proof) => acc + proof.amount, 0);

      // Create NIP-60 spend event
      const spendEvent = {
        kind: 7376,
        created_at: Math.floor(Date.now() / 1000),
        content: JSON.stringify({
          action: 'receive',
          amount: amount.toString(),
          mint: MINT_URL
        }),
        tags: [],
        pubkey: await window.nostr.getPublicKey()
      };

      const signedEvent = await window.nostr.signEvent(spendEvent);
      const ndkEvent = new NDKEvent(ndk, signedEvent);
      await ndkEvent.publish();

      // Update local state
      const updatedProofs = [...proofs, ...newProofs];
      setProofs(updatedProofs);
      localStorage.setItem('cashuProofs', JSON.stringify(updatedProofs));
      setBalance(balance + amount);

      // Record transaction
      const tx = {
        type: 'receive',
        amount,
        timestamp: Date.now()
      };
      const updatedTxs = [tx, ...transactions];
      setTransactions(updatedTxs);
      localStorage.setItem('cashuTransactions', JSON.stringify(updatedTxs));

      setReceivedToken('');
    } catch (err) {
      console.error('Error receiving tokens:', err);
      setError('Failed to receive tokens');
    }
  };

  const handleMelt = async () => {
    try {
      if (!meltInvoice) {
        throw new Error('No invoice provided');
      }

      // Create melt quote
      const meltQuote = await wallet.createMeltQuote(meltInvoice);
      const amountToSend = meltQuote.amount + meltQuote.fee_reserve;

      // Split proofs for melting
      const { send: proofsToMelt, keep: proofsToKeep } = await wallet.send(amountToSend, proofs, {
        includeFees: true
      });

      // Melt the proofs
      const meltResponse = await wallet.meltProofs(meltQuote, proofsToMelt);

      // Create NIP-60 spend event
      const spendEvent = {
        kind: 7376,
        created_at: Math.floor(Date.now() / 1000),
        content: JSON.stringify({
          action: 'melt',
          amount: amountToSend.toString(),
          mint: MINT_URL,
          invoice: meltInvoice
        }),
        tags: [],
        pubkey: await window.nostr.getPublicKey()
      };

      const signedEvent = await window.nostr.signEvent(spendEvent);
      const ndkEvent = new NDKEvent(ndk, signedEvent);
      await ndkEvent.publish();

      // Update local state
      const updatedProofs = [...proofsToKeep, ...meltResponse.change];
      setProofs(updatedProofs);
      localStorage.setItem('cashuProofs', JSON.stringify(updatedProofs));
      setBalance(updatedProofs.reduce((acc, proof) => acc + proof.amount, 0));

      // Record transaction
      const tx = {
        type: 'melt',
        amount: amountToSend,
        timestamp: Date.now(),
        invoice: meltInvoice
      };
      const updatedTxs = [tx, ...transactions];
      setTransactions(updatedTxs);
      localStorage.setItem('cashuTransactions', JSON.stringify(updatedTxs));

      setMeltInvoice('');
      alert('Payment sent successfully!');
    } catch (err) {
      console.error('Error melting tokens:', err);
      setError('Failed to melt tokens');
    }
  };

  return (
    <div className="cashu-wallet">
      {loading ? (
        <p>Loading wallet...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="wallet-balance">
            <h3>Balance: {balance} sats</h3>
          </div>

          <div className="wallet-actions">
            <div className="action-section">
              <h4>Mint Tokens</h4>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="Amount in sats"
              />
              <button onClick={handleMint}>Mint</button>
            </div>

            <div className="action-section">
              <h4>Send Tokens</h4>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="Amount in sats"
              />
              <button onClick={handleSend}>Send</button>
            </div>

            <div className="action-section">
              <h4>Receive Tokens</h4>
              <input
                type="text"
                value={receivedToken}
                onChange={(e) => setReceivedToken(e.target.value)}
                placeholder="Paste token here"
              />
              <button onClick={handleReceive}>Receive</button>
            </div>

            <div className="action-section">
              <h4>Pay Lightning Invoice</h4>
              <input
                type="text"
                value={meltInvoice}
                onChange={(e) => setMeltInvoice(e.target.value)}
                placeholder="Lightning invoice"
              />
              <button onClick={handleMelt}>Pay</button>
            </div>
          </div>

          <div className="transaction-history">
            <h4>Transaction History</h4>
            {transactions.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              <ul>
                {transactions.map((tx, index) => (
                  <li key={index}>
                    {tx.type === 'send' ? '↑' : tx.type === 'receive' ? '↓' : '⚡'} 
                    {tx.amount} sats - 
                    {new Date(tx.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}; 
