import React, { JSX, useState } from 'react'
import axios from 'axios';
import { UpdateProps } from './types'
import { AuthenticationResponseJSON, startAuthentication } from '@simplewebauthn/browser';
import { AgeKeySVG, defaultButtonStyle, LoadingDots } from './Shared';

const baseApiUrl = import.meta.env.VITE_OPALE_API_URL;
const authUrl = import.meta.env.VITE_OPALE_AUTH_URL;


export const AgeKeyUpdate = ({ publicKey, sessionId, ageThreshold = 18, verificationMethod, onResult, style }: UpdateProps): JSX.Element  => {
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

  async function handleUpdate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Check for Firefox and redirect if needed
      if (window.navigator.userAgent.search("Firefox") > -1) {
        const state = JSON.stringify({ ageThreshold: ageThreshold, verificationMethod: verificationMethod });
        const targetUrl = `${authUrl}/origin-relay/update/?sessionId=${sessionId}&publicKey=${publicKey}&state=${state}`;
        if (authUrl !== window.location.origin) {
          window.location.href = targetUrl;
          return;
        }
      }

      const authenticationnOptions = await getUpdateOptions(publicKey, sessionId, ageThreshold, verificationMethod);
      const startAuthenticationOptions = {
        optionsJSON: authenticationnOptions
      };
      const authenticationResponse = await startAuthentication(startAuthenticationOptions);
      const response = await verifyUpdate(publicKey, sessionId, authenticationResponse);
      onResult(response);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return <button onClick={handleUpdate} style={{ ...defaultButtonStyle, ...style }}><AgeKeySVG />{isLoading ? <LoadingDots /> : "Update"}</button>
}
