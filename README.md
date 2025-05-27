# AgeKey React

A React component library for AgeKey registration, authentication and modification. This package provides ready-to-use components to integrate age verification capabilities into your React applications.


## Installation

```bash
npm install opale-react
# or
yarn add opale-react
```

## Components

### AgeKeyRegister

Component for AgeKey registration with age verification.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| publicKey | string | Yes | Your Opale public key |
| sessionId | string | Yes | Unique session identifier |
| verificationMethod | 'ageEstimation' \| 'docScan' \| 'digitalId' \| 'creditCard' | Yes | The verification method used |
| ageThreshold | number | No | Age threshold for verification (defaults to 18) |
| onResult | (result: RegisterResult) => void | Yes | Callback function called with verification results |

#### Example

```jsx
import { AgeKeyRegister, RegisterResult } from 'opale-react';


function App() {

  const handleRegistration = (result: RegisterResult) => {
    console.log('Verification result:', result);

    if (result.message === 'registered') {
      // Handle successful registration
      console.log('AgeKey successfully registered');
      return true;
    };
    return false
  };


  return (
    <>
      {/* Registration component */}
      <AgeKeyRegister
        publicKey="your-public-key-here"
        sessionId="unique-session-id"
        verificationMethod="ageEstimation"
        ageThreshold={18} // Optional - Defaults to 18
        onResult={handleRegistration}
      />
    </>
  );
};

export default App;
```

### Registration Result response example

```typescript
{
  message: 'registered' | ErrorMessage
}
```


### AgeKeyAuthenticate

Component for authenticating previously registered AgeKey.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| publicKey | string | Yes | Your Opale public key |
| sessionId | string | Yes | Unique session identifier |
| onResult | (result: AuthenticateResult) => void | Yes | Callback function called with authentication results |

#### Example


```jsx
import { AgeKeyAuthenticate, AuthenticateResult, VerificationMethod } from 'opale-react';


function App() {

  const handleAuthentcation = (result: AuthenticateResult) => {
    const authenticationData = result.authenticationData;
    const acceptedMethods: VerificationMethod[] = ['ageEstimation', 'docScan']; // Array of accepted methods
    const requiredAge = 18; // Minimum required age

    for (let i = 0; i < acceptedMethods.length; i++) {
      const methodVerification = authenticationData?.[acceptedMethods[i] as VerificationMethod];
      if (methodVerification?.ageThreshold !== undefined &&
        methodVerification.ageThreshold >= requiredAge) {
        console.log("Authentication succesull");
        // handle successul verification
        return;
      }
    }
    console.log("Requirements not met");
    // handle failed verification
  };

  return (
    <>
      {/* Authentication component */}
      <AgeKeyAuthenticate
        publicKey="your-public-key-here"
        sessionId="unique-session-id"
        onResult={handleAuthentcation}
      />
    </>
  );
};

export default App;
```

### Authentication Result response example

```typescript
{
  message: 'authenticated',
  authenticationData: {
    ageEstimation: {
      ageThreshold: 18.0,
      date: "2025-03-04" // YYYY-MM-DD
    },
    docScan: {
      ageThreshold: 21.0,
      date: "2024-12-31"
    }
    // Other verifications displayed here
  }
}
```

### Update AgeKey

Component for adding new verifcation to existing AgeKey.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| publicKey | string | Yes | Your Opale public key |
| sessionId | string | Yes | Unique session identifier |
| verificationMethod | 'ageEstimation' \| 'docScan' \| 'digitalId' \| 'creditCard' | Yes | The verification method used |
| ageThreshold | number | No | Age threshold for verification (defaults to 18) |
| onResult | (result: RegisterResult) => void | Yes | Callback function called with verification results |

#### Example

```jsx
import { AgeKeyUpdate, UpdateResult } from "opale-react";

function App() {

  const handleUpdate = (result: UpdateResult) => {
    console.log('Update result:', result);

    if (result.message === 'updated') {
      // Handle successful update
      console.log('AgeKey successfully updated');
      return true;
    };
    return false
  };


  return (
    <>
      {/* Update component */}
      <AgeKeyUpdate
        publicKey="your-public-key-here"
        sessionId="unique-session-id"
        verificationMethod="ageEstimation"
        ageThreshold={18} // Optional - Defaults to 18
        onResult={handleUpdate}
      />
    </>
  );
};

export default App;
```

### Update Result response example

```typescript
{
  message: 'updated',
  authenticationData: {
    ageEstimation: {
      ageThreshold: 18.0,
      date: "2025-03-04" // YYYY-MM-DD
    },
    docScan: {
      ageThreshold: 21.0,
      date: "2024-12-31"
    }
    docScan: {
      ageThreshold: 21.0,
      date: "2025-02-28"
    }
  }
}
```


### Test AgeKey

Component for testing new AgeKey.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| publicKey | string | Yes | Your Opale public key |
| sessionId | string | Yes | Unique session identifier |
| onResult | (result: TestResult) => void | Yes | Callback function called with verification results |

#### Example

```jsx
import { AgeKeyTest, TestResult } from "opale-react";

function App() {

  const handleTest = (result: TestResult) => {
    console.log('Update result:', result);

    if (result.message === 'validated') {
      // Handle successful update
      console.log('AgeKey successfully validated');
      return true;
    };
    return false
  };

  return (
    <>
      {/* Test component */}
      <AgeKeyTest
        onResult={handleTest}
        publicKey="your-public-key-here"
        sessionId="unique-session-id"
        language={language}/>
    </>
  );
};

export default App;
```

### Test Result response example

```typescript
{
  message: 'validated'
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


## Browser Compatibility


### Firefox Support

Firefox does not currently support related origin requests on WebAuthn. To handle this limitation, the AgeKey components automatically detect Firefox browsers and implement a special flow. The React Hook included in the package demonstrates how to decode the signature. This should process however be handled serverside as your signing secret is required to validate the signature.

1. When a user is on Firefox, they are temporarily redirected to Opale's domain where the WebAuthn ceremony takes place.
2. After completion, they are redirected back to your application's callback URL with a signature.

Example of handling Firefox redirects post-ceremony:

```jsx
import { useOpaleSignature } from 'opale-react';

function App() {
  const { outcome, expiresIn, data } = useOpaleSignature({ signingSecret });

  return (
    <div>
        {outcome}
        <p>{expiresIn && `Expires in ${expiresIn} seconds`}</p>
        <p>{data && JSON.stringify(data)}</p>
    </div>
  )
}
```