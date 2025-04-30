import React, { CSSProperties } from 'react'

export const defaultButtonStyle: CSSProperties = {
    width: '240px',
    height: '40px',
    position: 'relative',
    fontSize: '17px',
    border: '1px solid #2c6cad',
    cursor: 'pointer',
    backgroundColor: '#2c6cad',
    color: 'white',
    borderRadius: '10px'
  };

const agekeyIcon: CSSProperties =  {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '10px'
}

const agekeyLoaderSvg: CSSProperties = {
    border: 'none',
    width: '100%',
    height: '90%'
}

const agekeyLoaderSvgCircle: CSSProperties = {
    fill: 'white'
}

export const AgeKeySVG: React.FunctionComponent = () => {
  return (
    <svg
      height="90%"
      viewBox="0 0 256 272"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      style={agekeyIcon}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M83 101C110.614 101 131 81.5 131.5 50C132 18.5 111.5 0 83 0C53 0 34.5 22.3858 34.5 50C34.5 82 55.3858 101 83 101ZM36 111C16.1178 111 0 127.118 0 147V152.134V156V192C0 203.046 8.9543 212 20 212H108L161 212.5V182.195C161.006 180.356 161.004 178.405 161.002 176.337C161.001 175.257 161 174.145 161 173V172H159.664C143.246 159.493 129.461 140.724 128 112V111H92H85H36ZM256 109.5C256 132.142 242.441 152.982 223 162.327V169.941L231.001 185.001L223 195.824V221.5L231.004 231.498L200.504 271.998L179.004 249.999L179 250V162.795C159.025 153.692 145 132.529 145 109.5C145 78.8482 169.848 54 200.5 54C231.152 54 256 78.8482 256 109.5ZM201 122C209.284 122 216 115.284 216 107C216 98.7157 209.284 92 201 92C192.716 92 186 98.7157 186 107C186 115.284 192.716 122 201 122Z"
        fill="white"
      />
    </svg>
  )
}

export const LoadingDots: React.FunctionComponent  = () => {
  return (
    <svg
      width="90%"
      version="1.1"
      id="L5"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 60 100"
      enableBackground="new 0 0 0 0"
      xmlSpace="preserve"
      style={agekeyLoaderSvg}
    >
      <circle stroke="none" cx="10" cy="50" r="6" style={agekeyLoaderSvgCircle}>
        <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 15 ; 0 -15; 0 15"
          repeatCount="indefinite"
          begin="0.1"
        />
      </circle>
      <circle stroke="none" cx="30" cy="50" r="6" style={agekeyLoaderSvgCircle}>
        <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 10 ; 0 -10; 0 10"
          repeatCount="indefinite"
          begin="0.2"
        />
      </circle>
      <circle stroke="none" cx="50" cy="50" r="6" style={agekeyLoaderSvgCircle}>
        <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 5 ; 0 -5; 0 5"
          repeatCount="indefinite"
          begin="0.3"
        />
      </circle>
    </svg>
  )
}