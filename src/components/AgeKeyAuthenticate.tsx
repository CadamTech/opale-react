import React, { JSX, useEffect, useState } from 'react'
import axios from 'axios';
import { AuthenticationResponseJSON, startAuthentication } from '@simplewebauthn/browser';
import { AgeKeySVG, defaultButtonStyle, LoadingDots } from './Shared';
import { AuthenticateProps } from './types'
import transations from '../translation.json';

const baseApiUrl = import.meta.env.VITE_OPALE_API_URL;
const authUrl = import.meta.env.VITE_OPALE_AUTH_URL;

export const AgeKeyAuthenticate = ({ publicKey, sessionId, onResult, style, language }: AuthenticateProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string | undefined>(undefined);


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


  async function handleAuthenticate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Check for Firefox and redirect if needed
      if (window.navigator.userAgent.search("Firefox") > -1) {
              // Create the target URL
      const targetUrl = `${authUrl}/origin-relay/authenticate/?sessionId=${sessionId}&publicKey=${publicKey}`;
        if (authUrl !== window.location.origin) {
          window.location.href = targetUrl;
          return;
        }
      }

      const authenticationOptions = await getAuthenticationOptions(publicKey, sessionId);
      const startAuthenticationOptions = {
        optionsJSON: authenticationOptions
      };
      const authenticationResponse = await startAuthentication(startAuthenticationOptions);
      const response = await verifyAuthentication(publicKey, sessionId, authenticationResponse);
      onResult(response);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

    useEffect(()=> {
        if(!language || (language !== 'fr' && language !== 'it')) {
          setText(transations[2]?.['en']);
        } else {
          setText(transations[2]?.[language]);
        }
    }, [language])

  return <button onClick={handleAuthenticate} style={{ ...defaultButtonStyle, ...style }}><AgeKeySVG />{isLoading ? <LoadingDots /> : text}</button>
}
