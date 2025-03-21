import React, { JSX, useState } from 'react'
import axios from "axios";
import { RegisterProps } from './types'
import { startRegistration, RegistrationResponseJSON  } from '@simplewebauthn/browser';
import { AgeKeySVG, defaultButtonStyle, LoadingDots } from './Shared';

const baseApiUrl = import.meta.env.VITE_OPALE_API_URL;
const authUrl = import.meta.env.VITE_OPALE_AUTH_URL;

export const AgeKeyRegister = ({ publicKey, sessionId, ageThreshold = 18, verificationMethod, onResult, style }: RegisterProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

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
        const targetUrl = `${authUrl}/origin-relay/register/?sessionId=${sessionId}&publicKey=${publicKey}&state=${state}`;
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

  return <button onClick={handleRegister} style={{ ...defaultButtonStyle, ...style }}><AgeKeySVG />{isLoading ? <LoadingDots /> : "Register"}</button>
}

