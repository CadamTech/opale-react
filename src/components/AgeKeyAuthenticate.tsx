import React, { useState } from 'react'
import { AuthenticateProps } from '../types'
import axios from 'axios';
import { AuthenticationResponseJSON, startAuthentication } from '@simplewebauthn/browser';
import { AgeKeySVG, LoadingDots } from './Shared';

const baseApiUrl = import.meta.env.VITE_OPALE_API_URL;

export const AgeKeyAuthenticate: React.FC<AuthenticateProps> = ({ publicKey, sessionId }) => {
  const [isLoading, setIsLoading] = useState(false);


  async function getAuthenticationOptions(publicKey: string, sessionId: string) {
    const url = `${baseApiUrl}/agekey/authentication-options/${sessionId}/?publicKey=${publicKey}`;
    const { data } = await axios.post(url);
    return data;
  };

  async function verifyAuthentication(publicKey: string, sessionId: string, authenticationResponse: AuthenticationResponseJSON) {
    const url = `${baseApiUrl}/agekey/verify-authentication/${sessionId}?publicKey=${publicKey}`;
    const { data } = await axios.post(url, {
      authenticationResponse: authenticationResponse,
    });
    return data
  };

  async function handleAuthenticate() {

    try {
      setIsLoading(true);
      const authenticationOptions = await getAuthenticationOptions(publicKey, sessionId);
      const startAuthenticationOptions = {
        optionsJSON: authenticationOptions
      };
      const authenticationResponse = await startAuthentication(startAuthenticationOptions);
      const response = await verifyAuthentication(publicKey, sessionId, authenticationResponse);
      parent.postMessage(response, "*");
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <button onClick={handleAuthenticate}><AgeKeySVG />{isLoading ? <LoadingDots /> : "Authenticate"}</button>
  )
}
