// For importing fonts
// import font from 'https://fonts.googleapis.com/css2?family=Fredoka:wght@600&family=Inter:opsz@15&display=swap'
import { CSSProperties } from "react"


// Button styles
export const ageKeyButton: CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  height: '60px',
  width: 'fit-content',
  padding: '0px',
  border: 'none',
  borderRadius: '40px',
  backgroundColor: 'transparent',
}

// Container styles
export const ageKeyStyleContainer: CSSProperties = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#3700C1',
  color: 'white',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '0px 30px 0px 30px',
  borderRadius: '40px',
  transitionDuration: '200ms',
  cursor: 'pointer'
}

// Hover state is handled differently in React (needs to be applied conditionally)
export const ageKeyStyleContainerHover = {
  backgroundColor: '#2D009F',
  transitionDuration: '200ms',
}

// Icon styles
export const ageKeyIcon: CSSProperties = {
  position: 'relative',
  width: '24px',
  height: '24px',
  marginLeft: '5px',
}

export const ageKeyPlusIcon: CSSProperties = {
  position: 'absolute',
  right: '2px',
  top: '3px',
}

export const ageKeyNumber: CSSProperties = {
  position: 'absolute',
  right: '5px',
  top: '3px',
  fontSize: '10px',
  fontFamily: '"Fredoka", sans-serif',
  color: '#3700C1',
}

// Loader styles
export const ageKeyLoaderContainer: CSSProperties = {
  position: 'absolute',
  left: '0px',
  width: '100%',
  height: '60px',
  borderRadius: '40px',
  backgroundColor: '#3700C1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const ageKeyLoader: CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'inline-block',
  borderTop: '3px solid #FFF',
  borderRight: '3px solid transparent',
  boxSizing: 'border-box',
  animation: 'rotation 1s linear infinite',
}