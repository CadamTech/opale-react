import { useState, useEffect } from 'react'
import { Outcome, CallbackData, Verifications } from '../components/types';

export const useOpaleSignature = ({signingSecret}: {signingSecret: string}): CallbackData => {
  const [outcome, setOutcome] = useState<Outcome>("pending");
  const [data, setData] = useState< Verifications | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    const validateSignature = async () => {
      const url = new URL(window.location.href);
      const sessionId = url.searchParams.get('sessionId');
      const timestamp = url.searchParams.get('timestamp');
      const result = url.searchParams.get('result');
      const signature = url.searchParams.get('signature');

      if (!sessionId || !timestamp || !result || !signature) {
        setOutcome('pending');
        return;
      }

      if (result !== 'ok') {
        setOutcome('verificationFailed');
        return;
      }

      try {
        // Check if the timestamp is older than 3 minutes
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const parsedTimestamp = parseInt(timestamp, 10);
        const timeStampDuration = 180;
        const timestampExpiresIn = timeStampDuration - (currentTimestamp - parsedTimestamp);
        
        setExpiresIn(timestampExpiresIn);
        
        if (timestampExpiresIn < 0) {
          setOutcome('timestampExpired');
          return;
        }
        
        const calculatedSignature = await calculateSignature(
          sessionId, 
          timestamp, 
          result as "ok" | "ko", 
          signingSecret
        );
        
        if (calculatedSignature === signature) {
          setOutcome('success');
          const encodedData = url.searchParams.get('data') || ''
          const decodedData = decodeURIComponent(encodedData ?? '');
          if (decodedData !== '') {
                 const data = JSON.parse(decodedData);
          setData(data)
          }
        } else {
          setOutcome('signatureMismatch');
        }
      } catch (error) {
        setOutcome('verificationFailed');
      }
    };
    
    validateSignature();
  }, [signingSecret]); // Re-run if signingSecret changes

  return { outcome, expiresIn, data };
}

async function calculateSignature(sessionId: string, timestamp: string, result: "ok" | "ko", signingSecret: string) {
  const data = `${sessionId}.${timestamp}.${result}`;

  const encoder = new TextEncoder();
  const secretBuffer = encoder.encode(signingSecret);
  const dataBuffer = encoder.encode(data);
  const subtle = crypto.subtle;

  const key = await subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );

  const signatureBuffer = await subtle.sign(
    'HMAC',
    key,
    dataBuffer
  );

  // Ensure lowercase hex output to match Python's hexdigest()
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signature = signatureArray.map(byte =>
    byte.toString(16).padStart(2, '0').toLowerCase()
  ).join('');

  return signature;
}