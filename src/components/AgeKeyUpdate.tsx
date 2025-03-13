import React, { useState } from 'react'
import { UpdateProps } from '../types'
import axios from 'axios';
import { AuthenticationResponseJSON, startAuthentication } from '@simplewebauthn/browser';
import { AgeKeySVG, LoadingDots } from './Shared';

const baseApiUrl = import.meta.env.VITE_OPALE_API_URL;

export const AgeKeyUpdate: React.FC<UpdateProps> = ({ publicKey, sessionId, ageThreshold = 18, verificationMethod }) => {
  const [isLoading, setIsLoading] = useState(false);

  async function getUpdateOptions(publicKey: string, sessionId: string, ageThreshold: number, verificationMethod: string) {
    const url = `${baseApiUrl}/agekey/update-options/${sessionId}/?publicKey=${publicKey}`;
    const { data } = await axios.post(url, {
      ageThreshold: ageThreshold,
      verificationMethod: verificationMethod,
    })
    return data;
  };

  async function verifyUpdate(publicKey: string, sessionId: string, authenticationResponse: AuthenticationResponseJSON) {
    const url = `${baseApiUrl}/agekey/verify-update/${sessionId}?publicKey=${publicKey}`;
    const { data } = await axios.post(url, {
      authenticationResponse: authenticationResponse
    });
    return data;
  };
  async function handleUpdate() {
    try {
      setIsLoading(true);
      const authenticationnOptions = await getUpdateOptions(publicKey, sessionId, ageThreshold, verificationMethod);
      const startAuthenticationOptions = {
        optionsJSON: authenticationnOptions
      };
      const authenticationResponse = await startAuthentication(startAuthenticationOptions);
      const response = await verifyUpdate(publicKey, sessionId, authenticationResponse);
      parent.postMessage(response, "*");
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <button onClick={handleUpdate}><AgeKeySVG />{isLoading ? <LoadingDots /> : "Update"}</button>
  )
}
