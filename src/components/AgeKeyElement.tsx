import React, { useEffect, useState, CSSProperties } from "react";

const baseIframeUrl = import.meta.env.VITE_BASE_IFRAME_URL;

// Common types
export type Ceremony = 'register' | 'authenticate' | 'update';
export type VerificationMethod = 'ageEstimation' | 'docScan' | 'digitalId' | 'creditCard';

// Error message type
export type ErrorMessage =
  | "Public key not provided"
  | "Invalid verification method"
  | "Registration response not provided"
  | "Authentication response not provided"
  | "Invalid public key"
  | "Session expired"
  | "Challenge not found"
  | "Challenge expired"
  | "Credential not found, please create new credential"
  | "Internal server error";


export type RegisterMessage = 'registered' | ErrorMessage;

export interface RegisterResult {
  message: RegisterMessage;
}

export type AuthenticateMessage = 'authenticated' | ErrorMessage;

export interface AuthenticateResult {
  message: AuthenticateMessage;
  authenticationData: Verifications;
}

export interface VerificationDetails {
  ageThreshold: number;
  date: string; // YYYY-MM-DD
}

export type Verifications = {
  [K in VerificationMethod]?: VerificationDetails;
};


export type UpdateMessage = 'updated' | ErrorMessage;
export interface UpdateResult {
  message: UpdateMessage;
}

// Union type for all possible results
export type AgeKeyResult = RegisterResult | AuthenticateResult | UpdateResult;


// Base props interface
export interface BaseAgeKeyProps {
  publicKey: string;
  sessionId: string;
  ageThreshold?: number;
  verificationMethod?: VerificationMethod;
  onResult: any;
  style?: React.CSSProperties;
}

// Ceremony-specific props with typed onResult callbacks
export interface RegisterProps extends BaseAgeKeyProps {
  onResult: (data: RegisterResult) => void;
}

export interface AuthenticateProps extends BaseAgeKeyProps {
  onResult: (data: AuthenticateResult) => void;
}

export interface UpdateProps extends BaseAgeKeyProps {
  onResult: (data: UpdateResult) => void;
}

// Generic props for the base component
interface BaseComponentProps extends BaseAgeKeyProps {
  ceremony: Ceremony;
}

// Base AgeKey component that handles common functionality
function BaseAgeKeyElement<T extends AgeKeyResult>({
  publicKey,
  sessionId,
  ageThreshold = 18,
  verificationMethod,
  ceremony,
  onResult,
  style
}: BaseComponentProps) {
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    // Construct URL with parameters
    const url = new URL(baseIframeUrl);
    url.searchParams.append('ceremony', ceremony);
    url.searchParams.append('publicKey', publicKey);
    url.searchParams.append('sessionId', sessionId);
    url.searchParams.append('ageThreshold', ageThreshold.toString());

    if (verificationMethod) {
      url.searchParams.append('verificationMethod', verificationMethod);
    }

    if (style) {
      url.searchParams.append('style', JSON.stringify(style));
    }

    setIframeUrl(url.toString());
  }, [publicKey, sessionId, ageThreshold, verificationMethod, ceremony]);

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      // Ensure the message is from your iframe's origin
      if (new URL(baseIframeUrl).origin !== event.origin) return;

      // Handle the received message
      if (onResult) {
        // Cast the event data to the appropriate result type
        // This is safe because the iframe should send the correct result type based on ceremony
        const result = event.data as T;
        onResult(result);
      }
    };

    window.addEventListener("message", messageListener);

    return () => {
      window.removeEventListener("message", messageListener);
    };
  }, [onResult]);

  // Default styles
  const iframeStyle: CSSProperties = {
    display: 'block',
    margin: '0px',
    padding: '0px',
    border: 'none',
    borderRadius: '8px',
    width: '200px',
    height: '40px',
    transition: 'height 0.4s',
    ...style
  };

  // Set appropriate allow attribute based on ceremony
  const getAllowAttribute = (ceremony: Ceremony) => {
    switch (ceremony) {
      case 'register':
        return "publickey-credentials-create *";
      case 'authenticate':
        return "publickey-credentials-get *";
      case 'update':
        return "publickey-credentials-create *; publickey-credentials-get *";
      default:
        return "publickey-credentials-create *; publickey-credentials-get *";
    }
  };

  if (iframeUrl) {
    return <iframe
      scrolling='no'
      allow={getAllowAttribute(ceremony)}
      loading="lazy"
      src={iframeUrl}
      style={iframeStyle}>
    </iframe>
  }

  return <div style={iframeStyle}>
    ...
  </div>

}

// Registration-specific component with typed result
export const AgeKeyRegister: React.FC<RegisterProps> = (props) => {
  return <BaseAgeKeyElement<RegisterResult> {...props} ceremony="register" />;
};

// Authentication-specific component with typed result
export const AgeKeyAuthenticate: React.FC<AuthenticateProps> = (props) => {
  return <BaseAgeKeyElement<AuthenticateResult> {...props} ceremony="authenticate" />;
};

// Update-specific component with typed result (for future use)
export const AgeKeyUpdate: React.FC<UpdateProps> = (props) => {
  return <BaseAgeKeyElement<UpdateResult> {...props} ceremony="update" />;
};