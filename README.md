# Opale AgeKey

A React component library for AgeKey registration and authentication. This package provides ready-to-use components to integrate age verification capabilities into your React applications.


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
| onResult | (result: RegisterResult) => any | Yes | Callback function called with verification results |

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
    <div>
      {/* Registration component */}
      <AgeKeyRegister
        publicKey="your-public-key-here"
        sessionId="unique-session-id"
        verificationMethod="ageEstimation"
        ageThreshold={18} // Optional - Defaults to 18
        onResult={handleRegistration}
      />
    </div>
  );
};

export default App;
```

## Response Types

The `onResult` callback receives one of the following result types:

### Registration Result

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
| onResult | (result: AuthenticateResult) => any | Yes | Callback function called with authentication results |

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
    <div>
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

### Authentication Result Example

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
    // Other linked verifications can be added
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
| onResult | (result: RegisterResult) => any | Yes | Callback function called with verification results |

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
    <div>
      {/* Update component */}
      <AgeKeyUpdate
        publicKey="your-public-key-here"
        sessionId="unique-session-id"
        verificationMethod="ageEstimation"
        ageThreshold={18} // Optional - Defaults to 18
        onResult={handleUpdate}
      />
    </div>
  );
};

export default App;
```

### Update Result Example

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


### Styling

The `style` prop allows custom styling for each AgeKey component. Pass a JavaScript object with CSS properties in camelCase. These styles will be applied to the iframe and button element element.

## Example:

```tsx
<AgeKeyAuthenticate
  publicKey="your-public-key-here"
  sessionId="unique-session-id"
  onResult={handleRegistration}
  style={{
    backgroundColor: 'green',
    width: '600px',
    height: '30px',
    borderRadius: '0'
  }}
/>
```
