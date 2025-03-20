export { AgeKeyRegister } from './components/AgeKeyRegister';
export { AgeKeyAuthenticate } from './components/AgeKeyAuthenticate';
export { AgeKeyUpdate } from './components/AgeKeyUpdate';
export { useOpaleSignature } from './hooks/useOpaleSignature'
export type {
        Ceremony,
        VerificationMethod,
        VerificationDetails,
        ErrorMessage,
        RegisterMessage,
        RegisterResult,
        AuthenticateMessage,
        AuthenticateResult,
        UpdateMessage,
        UpdateResult,
        BaseAgeKeyProps,
        RegisterProps,
        AuthenticateProps,
        UpdateProps,
        CallbackData
 } from './components/types';