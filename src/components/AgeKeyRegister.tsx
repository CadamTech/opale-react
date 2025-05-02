import React, { JSX, useEffect, useState } from 'react'
import axios from "axios";
import { RegisterProps } from './types'
import { startRegistration, RegistrationResponseJSON  } from '@simplewebauthn/browser';
import { AgeKeySVG, defaultButtonStyle, LoadingDots } from './Shared';
import transations from '../translation.json';

const baseApiUrlDev = import.meta.env.VITE_OPALE_API_URL_DEV;
const authUrlDev = import.meta.env.VITE_OPALE_AUTH_URL_DEV;

const baseApiUrlStage = import.meta.env.VITE_OPALE_API_URL_STAGE
const authUrlStage = import.meta.env.VITE_OPALE_AUTH_URL_STAGE

const baseApiUrlProd = import.meta.env.VITE_OPALE_API_URL_PROD
const authUrlProd = import.meta.env.VITE_OPALE_AUTH_URL_PROD

export const AgeKeyRegister = ({ publicKey, sessionId, ageThreshold = 18, verificationMethod, onResult, style, language, buttonText }: RegisterProps): JSX.Element => {
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

  async function getRegistrationOptions(publicKey: string, sessionId: string, ageThreshold: number, verificationMethod: string) {
    const url = `${baseApiUrl}/agekey/registration-options/${sessionId}/?publicKey=${publicKey}`;
    const { data } = await axios.post(url, {
      ageThreshold: ageThreshold,
      verificationMethod: verificationMethod,
    })
    return data;
  };

  async function verifyRegistration(publicKey: string, sessionId: string, registrationResponse: RegistrationResponseJSON) {
    const url = `${baseApiUrl}/agekey/verify-registration/${sessionId}?publicKey=${publicKey}`;
    const { data } = await axios.post(url, {
      registrationResponse: registrationResponse,
    });
    return data;
  };

  async function handleRegister(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Check for Firefox and redirect if needed
      if (window.navigator.userAgent.search("Firefox") > -1) {
        const state = JSON.stringify({ ageThreshold: ageThreshold, verificationMethod: verificationMethod });
        const targetUrl = `${authUrl}/origin-relay/register/?sessionId=${sessionId}&publicKey=${publicKey}&state=${encodeURIComponent(state)}`;
        if (authUrl !== window.location.origin) {
          window.location.href = targetUrl;
          return;
        }
      }

      const registrationOptions = await getRegistrationOptions(publicKey, sessionId, ageThreshold, verificationMethod);
      const startRegistrationOptions = {
        optionsJSON: registrationOptions
      };
      const registrationResponse = await startRegistration(startRegistrationOptions);
      const response = await verifyRegistration(publicKey, sessionId, registrationResponse);
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
        setText(transations[3]?.['en']);
      } else {
        setText(transations[3]?.[language]);
      }
  }, [language])

  return <button onClick={handleRegister} style={{ ...defaultButtonStyle, ...style }}><AgeKeySVG />{isLoading ? <LoadingDots /> : text}</button>
}

