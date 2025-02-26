# Opale AgeKey

A React component library for AgeKey registration and authentication. This package provides ready-to-use components to integrate age verification capabilities into your React applications.


## Installation

```bash
npm install opale-react
# or
yarn add opale-react
```

## Usage


```jsx
// Components
import { AgeKeyRegister, AgeKeyAuthenticate } from 'opale-react';
// Types
import { RegisterResult, AuthenticateResult } from 'opale-react';

function App() {

  const handleRegistration = (result: RegisterResult) => {
    console.log('Verification result:', result);

    if (result.message === 'registered') {
      // Handle successful registration
      console.log('User successfully registered');
      return true;
    };
    return false
  };

  const handleAuthentcation = (result: AuthenticateResult) => {
    console.log('authentication result:', result);

    const authenticationData = result.authenticationData;
    const acceptedMethods = ['ageEstimation', 'docScan'];
    const requiredAge = 18;

    for (const method of Object.keys(authenticationData)) {
      if (acceptedMethods.includes(method)) {
        const age = authenticationData[method];
        if (age >= requiredAge) {
          // Handle successful authencation
          console.log('User successfully authenticated');
          return true;
        }
      }
      return false
    }
  };

  return (
    <div className="verification-container">
      {/* Registration component */}
      <AgeKeyRegister
        publicKey="your-public-key-here"
        sessionId="unique-session-id"
        verificationMethod="ageEstimation"
        ageThreshold={18} // Optional - Defaults to 18
        onResult={handleRegistration}
      />

      {/* Authentication component */}
      <AgeKeyAuthenticate
        publicKey="your-public-key-here"
        sessionId="unique-session-id"
        onResult={handleAuthentcation}
      />
    </div>
  );
};

export default App;
```


## Components

### AgeKeyRegister

Component for user registration with age verification.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| publicKey | string | Yes | Your Opale public key |
| sessionId | string | Yes | Unique session identifier |
| verificationMethod | 'ageEstimation' \| 'docScan' \| 'digitalId' \| 'creditCard' | Yes | The verification method used |
| ageThreshold | number | No | Age threshold for verification (defaults to 18) |
| onResult | (result: RegisterResult) => any | Yes | Callback function called with verification results |

### AgeKeyAuthenticate

Component for authenticating previously registered users.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| publicKey | string | Yes | Your Opale public key |
| sessionId | string | Yes | Unique session identifier |
| onResult | (result: AuthenticateResult) => any | Yes | Callback function called with authentication results |

## Response Types

The `onResult` callback receives one of the following result types:

### Registration Result

```typescript
{
  message: 'registered' | ErrorMessage
}
```

### Authentication Result

```typescript
{
  message: 'authenticated' | ErrorMessage,
  authenticationData: {
    ageEstimation: number;
    docScan: number;
    digitalId: number;
    creditCard: number;
  }
}
```

### Error Messages

Possible error messages include:
- "Public key not provided"
- "Invalid verification method"
- "Registration response not provided"
- "Authentication response not provided"
- "Invalid public key"
- "Session expired"
- "Challenge not found"
- "Challenge expired"
- "Credential not found, please create new credential"
- "Internal server error"


### Custom Styling

Coming soon