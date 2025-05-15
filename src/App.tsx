// Located './src'
import React from 'react'
import { AgeKeyRegister } from '../src/components/AgeKeyRegister'
import { AgeKeyAuthenticate } from '../src/components/AgeKeyAuthenticate'
import { AgeKeyUpdate } from '../src/components/AgeKeyUpdate'

function App() {

  return (
    <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
      <AgeKeyRegister
        verificationMethod={'docScan'}
        onResult={()=>console.log()}
        publicKey={''}
        sessionId={''} />
      <AgeKeyAuthenticate
        onResult={()=>console.log()}
        publicKey={''}
        sessionId={''} />
      <AgeKeyUpdate
        verificationMethod={'docScan'}
         onResult={()=>console.log()}
        publicKey={''}
        sessionId={''} />
    </div>
  )
}

export default App