import React, { JSX, useState, useEffect } from 'react'
import axios from 'axios';
import { UpdateProps } from './types'
import { AuthenticationResponseJSON, startAuthentication } from '@simplewebauthn/browser';
import { AgeKeySVG, defaultButtonStyle, LoadingDots } from './Shared';
import transations from '../translation.json';

const baseApiUrlDev = import.meta.env.VITE_OPALE_API_URL_DEV;
const authUrlDev = import.meta.env.VITE_OPALE_AUTH_URL_DEV;

const baseApiUrlStage = import.meta.env.VITE_OPALE_API_URL_STAGE
const authUrlStage = import.meta.env.VITE_OPALE_AUTH_URL_STAGE

const baseApiUrlProd = import.meta.env.VITE_OPALE_API_URL_PROD
const authUrlProd = import.meta.env.VITE_OPALE_AUTH_URL_PROD

export const AgeKeyUpdate = ({ publicKey, sessionId, ageThreshold = 18, verificationMethod, onResult, style, language, buttonText}: UpdateProps): JSX.Element  => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string | undefined>(undefined);

  // Determine the correct URLs immediately based on publicKey
  const getEnvironmentUrls = (key: string) => {
    if (key.startsWith("dev-")) {
      return { baseApiUrl: baseApiUrlDev, authUrl: authUrlDev };
    } else if (key.startsWith("staging-")) {
      return { baseApiUrl: baseApiUrlStage, authUrl: authUrlStage };
    } else {
      return { baseApiUrl: baseApiUrlProd, authUrl: authUrlProd };
    }
  };

  const { baseApiUrl, authUrl } = getEnvironmentUrls(publicKey);

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
        const targetUrl = `${authUrl}/origin-relay/update/?sessionId=${sessionId}&publicKey=${publicKey}&state=${encodeURIComponent(state)}`;
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

  useEffect(()=> {
      if (buttonText) {
      setText(buttonText);
      } else if(!language || (language !== 'fr' && language !== 'it')) {
        setText(transations[4]?.['en']);
      } else {
        setText(transations[4]?.[language]);
      }
  }, [language])

  return <button onClick={handleUpdate} style={{ ...defaultButtonStyle, ...style }}><AgeKeySVG />{isLoading ? <LoadingDots /> : text}</button>
}
