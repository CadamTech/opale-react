import React, { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import { TestProps } from './types';
import { AuthenticationResponseJSON, startAuthentication } from '@simplewebauthn/browser';
import { AgeKeyTestStyleComponent, getEnvironmentUrls } from './Shared';
import { ageKeyButton } from "./style";

export const AgeKeyTest = ({ publicKey, sessionId, onResult, language }: TestProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [{baseApiUrl, authUrl }, setEnvironmentUrls] = useState({baseApiUrl: "", authUrl: ""});


  useEffect(() => {
    if (!publicKey || !sessionId) return
    setEnvironmentUrls(getEnvironmentUrls(publicKey));
    setIsLoading(false);
  }, [publicKey, sessionId]);

  async function getTestOptions(publicKey: string, sessionId: string) {
    const url = `${baseApiUrl}/agekey/test-options/${sessionId}/?publicKey=${publicKey}`;
    const { data } = await axios.post(url);
    return data;
  };

  async function verifyTest(publicKey: string, sessionId: string, testResponse: AuthenticationResponseJSON) {
    const url = `${baseApiUrl}/agekey/verify-test/${sessionId}?publicKey=${publicKey}`;
    const { data } = await axios.post(url, {
      testResponse: testResponse,
    });
    return data
  };

  async function handleTest(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Check for Firefox and redirect if needed
      if (window.navigator.userAgent.search("Firefox") > -1) {
        // Create the target URL
        const targetUrl = `${authUrl}/origin-relay/test/?sessionId=${sessionId}&publicKey=${publicKey}`;
        if (authUrl !== window.location.origin) {
          window.location.href = targetUrl;
          return;
        }
      }

      const testOptions = await getTestOptions(publicKey, sessionId);
      const startTestOptions = {
        optionsJSON: testOptions
      };
      const testResponse = await startAuthentication(startTestOptions);
      const response = await verifyTest(publicKey, sessionId, testResponse);
      onResult(response);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    };
  };

  return <button style={{...ageKeyButton}} onClick={handleTest} disabled={isLoading}>
    <AgeKeyTestStyleComponent isLoading={isLoading} language={language || 'en'} />
  </button>
};
