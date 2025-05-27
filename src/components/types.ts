// Common types
export type Language = 'en' | 'fr';
export type Ceremony = 'register' | 'authenticate' | 'update' | 'test';
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

export type Verifications = {
  [K in VerificationMethod]?: VerificationDetails;
};

export interface VerificationDetails {
  ageThreshold: number;
  date: string; // YYYY-MM-DD
};

export type RegisterMessage = 'registered'
export interface RegisterResult {
  message: RegisterMessage;
  error: ErrorMessage
  redirectUrl?: string
};

type AuthenticateMessage = 'authenticated'
export interface AuthenticateResult {
  message: AuthenticateMessage;
  error: ErrorMessage
  authenticationData: Verifications;
  redirectUrl?: string
};

type UpdateMessage = 'updated'
export interface UpdateResult {
  message: UpdateMessage;
  error: ErrorMessage
  authenticationData: Verifications;
  redirectUrl?: string
};

type AgeKeyTestMessage = 'validated'
export type TestResult = {
  message: AgeKeyTestMessage
  error: ErrorMessage
}

// Base props interface
export interface BaseAgeKeyProps {
  publicKey: string;
  sessionId: string;
  ageThreshold?: number;
  language?: Language;
};

export interface StyleAgeKeyProps {
  ceremony: Ceremony;
  ageThreshold: number;
  language: Language;
  isLoading: boolean;
};

export interface StyleAgeKeyTestProps {
  language: Language;
  isLoading: boolean;
}

// Ceremony-specific props with typed onResult callbacks
export interface AuthenticateProps extends BaseAgeKeyProps{
  onResult: (result: AuthenticateResult) => void;
};

export interface RegisterProps  extends BaseAgeKeyProps{
  verificationMethod: VerificationMethod;
  onResult: (result: RegisterResult) => void;
};

export interface UpdateProps extends BaseAgeKeyProps{
  verificationMethod: VerificationMethod;
  onResult: (result: UpdateResult) => void;
};

export interface TestProps extends BaseAgeKeyProps{
  onResult: (result: TestResult) => void;
};

export type Outcome = "pending" | "signatureMismatch" | "timestampExpired" | "verificationFailed" | "success";

export type CallbackData = { 
  outcome: Outcome,
  expiresIn: number | null,
  data: Verifications | null
};