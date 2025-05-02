import React from 'react';

// Common types
export type Ceremony = 'register' | 'authenticate' | 'update';
export type VerificationMethod = "docScan" | "ageEstimation" | "digitalId" | "creditCard" | "mobile" | "ftn" | "swedishBankId" | "mitId" | "laWallet" | "socialSecurityNumber" | "usFloridaHb3" | "address" | "emailDirectCheck" | "doubleAnonymity"
      
// Error message type
export type ErrorMessage =
  | "Public key not provided"
  | "Invalid verification method"
  | "Registration response not provided"
  | "Authentication response not provided"
  | "Invalid public key"
  | "Session expired"
  | "Credential not found, please create new credential";


export type RegisterMessage = 'registered' | ErrorMessage;

export type Language = 'en' | 'fr' | 'it';

export interface RegisterResult {
  message: RegisterMessage;
  redirectUrl?: string
}

export type AuthenticateMessage = 'authenticated' | ErrorMessage;

export interface VerificationDetails {
  ageThreshold: number;
  date: string; // YYYY-MM-DD
}

export type Verifications = {
  [K in VerificationMethod]?: VerificationDetails;
};

export interface AuthenticateResult {
  message: AuthenticateMessage;
  authenticationData: Verifications;
  redirectUrl?: string
}

export type UpdateMessage = 'updated' | ErrorMessage;
export interface UpdateResult {
  message: UpdateMessage;
  authenticationData: Verifications;
  redirectUrl?: string
}


// Base props interface
export interface BaseAgeKeyProps {
  publicKey: string;
  sessionId: string;
  style?: React.CSSProperties;
  language?: Language;
  buttonText?: string;
}

// Ceremony-specific props with typed onResult callbacks
export interface RegisterProps extends BaseAgeKeyProps {
  verificationMethod: VerificationMethod;
  ageThreshold?: number;
  onResult: (data: RegisterResult) => void;
}

export interface AuthenticateProps extends BaseAgeKeyProps {
  onResult: (data: AuthenticateResult) => void;
}

export interface UpdateProps extends BaseAgeKeyProps {
  verificationMethod: VerificationMethod;
  ageThreshold?: number;
  onResult: (data: UpdateResult) => void;
}

export type Outcome = "pending" | "signatureMismatch" | "timestampExpired" | "verificationFailed" | "success"

export type CallbackData = { 
  outcome: Outcome,
  expiresIn: number | null,
  data: Verifications | null
}