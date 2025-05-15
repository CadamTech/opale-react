import React, { JSX, useState } from 'react'
import axios from 'axios';
import { AuthenticateProps } from './types'
import { AuthenticationResponseJSON, startAuthentication } from '@simplewebauthn/browser';
import { AgeKeyStyleComponent } from './Shared';
import { useEnvironmentUrls } from "../hooks/useEnvironmentUrl"
import { ageKeyButton } from "./style"

export const AgeKeyAuthenticate = ({ publicKey, sessionId, onResult, ageThreshold, language }: AuthenticateProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const { baseApiUrl, authUrl } = useEnvironmentUrls(publicKey)

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
      setIsLoading(true);
  setTimeout(() => setIsLoading(false), 10000)
return
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

  return <button style={{...ageKeyButton}} onClick={handleAuthenticate} >
    <AgeKeyStyleComponent ceremony='authenticate' language={language} ageThreshold={ageThreshold} isLoading={isLoading}/>
  </button>
}
