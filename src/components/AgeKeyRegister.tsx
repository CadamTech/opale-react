import React, { useState } from 'react'
import { RegisterProps } from '../types'
import { startRegistration } from '@simplewebauthn/browser';
import { AgeKeySVG, LoadingDots } from './Shared';
import { RegistrationResponseJSON } from "@simplewebauthn/browser";
import axios from "axios";

const baseApiUrl = import.meta.env.VITE_OPALE_API_URL;

export const AgeKeyRegister: React.FC<RegisterProps> = ({ publicKey, sessionId, ageThreshold = 18, verificationMethod }) => {
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
      const registrationOptions = await getRegistrationOptions(publicKey, sessionId, ageThreshold, verificationMethod);
      const startRegistrationOptions = {
        optionsJSON: registrationOptions
      };
      const registrationResponse = await startRegistration(startRegistrationOptions);
      const response = await verifyRegistration(publicKey, sessionId, registrationResponse);
      parent.postMessage(response, "*");
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button onClick={handleRegister} className='agekey-button'><AgeKeySVG />{isLoading ? <LoadingDots /> : "Register"}</button>
  )
}

