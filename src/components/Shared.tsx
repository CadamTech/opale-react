import React, { useEffect, useState } from 'react'
import { Language, StyleAgeKeyProps } from './types';
import transations from '../translation.json'
import { ageKeyStyleContainer, ageKeyStyleContainerHover, ageKeyPlusIcon, ageKeyIcon, ageKeyNumber, ageKeyLoaderContainer, ageKeyLoader} from './style'

const baseApiUrlDev = import.meta.env.VITE_OPALE_API_URL_DEV;
const authUrlDev = import.meta.env.VITE_OPALE_AUTH_URL_DEV;

const baseApiUrlStage = import.meta.env.VITE_OPALE_API_URL_STAGE
const authUrlStage = import.meta.env.VITE_OPALE_AUTH_URL_STAGE

const baseApiUrlProd = import.meta.env.VITE_OPALE_API_URL_PROD
const authUrlProd = import.meta.env.VITE_OPALE_AUTH_URL_PROD


export function getEnvironmentUrls (publicKey: string): {baseApiUrl: string, authUrl: string} {
    if (publicKey.startsWith("dev-")) {
      return { baseApiUrl: baseApiUrlDev, authUrl: authUrlDev };
    } else if (publicKey.startsWith("staging-")) {
      return { baseApiUrl: baseApiUrlStage, authUrl: authUrlStage };
    } else {
      return { baseApiUrl: baseApiUrlProd, authUrl: authUrlProd };
    }
}

const PlusIconSVG: React.FunctionComponent = () => {
  return <svg
    width="5"
    height="5"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{...ageKeyPlusIcon}}>
    <path d="M4.35625 8.85V6.69375H2.14375C1.43125 6.69375 0.85 6.1125 0.85 5.4C0.85 4.6875 1.43125 4.10625 2.14375 4.10625H4.35625V1.95C4.35625 1.21875 4.95625 0.618749 5.6875 0.618749C6.41875 0.618749 7.01875 1.21875 7.01875 1.95V4.10625H9.23125C9.94375 4.10625 10.525 4.6875 10.525 5.4C10.525 6.1125 9.94375 6.69375 9.23125 6.69375H7.01875V8.85C7.01875 9.58125 6.41875 10.1812 5.6875 10.1812C4.95625 10.1812 4.35625 9.58125 4.35625 8.85Z" fill="#3700C1" />
  </svg>

}

const AgeKeyIconSVG: React.FunctionComponent<{ age?: number }> = ({ age }) => {
  return (
    <div style={{...ageKeyIcon}}>
      <span style={{...ageKeyNumber}}>{age}</span>
      <PlusIconSVG />
      <svg
        width="24"
        height="24"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {age}
        <path d="M102.179 115.451C113.602 115.473 124.775 112.104 134.282 105.769C143.79 99.4349 151.204 90.4205 155.586 79.868C159.967 69.3155 161.12 57.6994 158.897 46.4914C156.673 35.2833 151.175 24.9872 143.097 16.9075C135.02 8.82771 124.727 3.32753 113.522 1.10375C102.317 -1.12003 90.704 0.0325807 80.1545 4.41554C69.6049 8.79851 60.5931 16.2148 54.2604 25.7248C47.9277 35.2348 44.5591 46.411 44.5812 57.8375C44.5851 63.8129 45.5035 69.7526 47.3044 75.45L2.31428 120.334C1.57791 121.06 0.993981 121.926 0.596802 122.881C0.199623 123.836 -0.00280028 124.86 0.00142317 125.894L0.00142317 152.015C-0.0184864 153.059 0.170676 154.097 0.557783 155.068C0.94489 156.038 1.52212 156.922 2.25552 157.666C2.98892 158.41 3.86367 158.999 4.82832 159.4C5.79296 159.801 6.82802 160.005 7.87259 160H33.9854C35.0205 160.005 36.0462 159.805 37.0034 159.411C37.9606 159.017 38.8303 158.437 39.5622 157.705C40.2941 156.973 40.8737 156.103 41.2675 155.145C41.6613 154.188 41.8615 153.162 41.8566 152.127V139.029H54.9876C57.0722 139.019 59.0685 138.187 60.5426 136.712C62.0166 135.238 62.849 133.241 62.8588 131.156L62.8588 118.021H75.9525C76.9864 118.025 78.0106 117.823 78.9651 117.425C79.9197 117.028 80.7852 116.444 81.5108 115.708L84.5712 112.727C90.267 114.529 96.205 115.447 102.179 115.451Z" fill="white" />
      </svg>
    </div>
  )
}

const AgeKeyTextSVG: React.FunctionComponent = () => {
  return (
    <svg
      width="73"
      height="25"
      viewBox="0 0 480 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M0.87 77L35.19 -5.24521e-06H62.14L96.46 77H73.47L66.43 60.5H30.46L23.31 77H0.87ZM37.28 44.66H59.61L48.5 18.59L37.28 44.66ZM136.1 101.2C112.67 101.2 100.57 95.59 100.57 84.92C100.57 80.63 102.66 76.89 106.29 73.59C102.66 70.84 100.68 66.99 100.68 62.37C100.68 56.1 104.2 51.04 110.14 48.95C106.62 46.09 104.86 42.35 104.86 37.73C104.86 25.41 116.63 18.81 139.07 18.81C144.24 18.81 148.86 19.14 152.82 19.8C154.36 6.82 160.52 1.64999 174.05 1.64999H177.02V17.93H174.05C168.55 17.93 165.91 19.47 165.14 23.98C170.31 27.17 172.95 31.68 172.95 37.62C172.95 49.72 161.62 55.99 139.95 55.99H139.29L122.35 55.88C119.27 55.88 117.62 56.87 117.62 58.74C117.62 60.5 119.16 61.38 122.02 61.38H148.53C169.65 61.38 178.23 66.55 178.23 78.87C178.23 94.16 164.92 101.2 136.1 101.2ZM121.03 82.06C121.03 85.91 125.98 87.34 138.52 87.34C151.94 87.34 157 85.91 157 82.28C157 79.2 153.7 77.99 147.32 77.99H122.79C121.47 79.42 121.03 80.85 121.03 82.06ZM125.32 37.4C125.32 40.81 129.72 42.24 138.96 42.24C148.2 42.24 152.49 40.81 152.49 37.4C152.49 33.99 148.2 32.56 138.85 32.56C129.61 32.56 125.32 33.99 125.32 37.4ZM214.316 79.2C193.086 79.2 178.896 67.76 178.896 49.06C178.896 30.69 192.426 18.81 213.656 18.81C237.856 18.81 251.166 32.78 247.536 54.45H199.906C201.006 60.83 206.836 64.35 214.536 64.35C220.586 64.35 225.976 61.93 227.736 57.53L246.876 58.74C245.116 71.28 232.356 79.2 214.316 79.2ZM200.016 39.82H227.076C226.196 34.98 220.916 32.23 213.876 32.23C206.506 32.23 201.226 34.98 200.016 39.82ZM255.634 77V-5.24521e-06H277.634V31.24L310.634 -5.24521e-06H337.474L304.144 31.24L338.574 77H310.854L288.414 45.98L277.634 56.1V77H255.634ZM371.475 79.2C350.245 79.2 336.055 67.76 336.055 49.06C336.055 30.69 349.585 18.81 370.815 18.81C395.015 18.81 408.325 32.78 404.695 54.45H357.065C358.165 60.83 363.995 64.35 371.695 64.35C377.745 64.35 383.135 61.93 384.895 57.53L404.035 58.74C402.275 71.28 389.515 79.2 371.475 79.2ZM357.175 39.82H384.235C383.355 34.98 378.075 32.23 371.035 32.23C363.665 32.23 358.385 34.98 357.175 39.82ZM407.749 100.87V85.58H420.399C427.549 85.58 431.069 83.6 433.709 78.1L403.569 21.01H426.559L443.609 55.99L459.119 21.01H479.249L453.509 78.21C446.139 95.04 437.669 100.87 421.279 100.87H407.749Z" fill="white" />
    </svg>
  )
}

export const AgeKeyStyleComponent: React.FC<StyleAgeKeyProps> = ({ language, ageThreshold, ceremony, isLoading }) => {
  const [text, setText] = useState("")
  const [dynamicStyle, setDynamicStyle] = useState({...ageKeyStyleContainer})


  useEffect(() => {
    if (!language || language !== 'fr') {
      setText(transations[ceremony]?.['en'] as string);
    } else {
      setText(transations[ceremony]?.[language as Language] as string);
    }
  }, [language])

  return <div style={{...dynamicStyle}} onMouseEnter={()=>setDynamicStyle({...ageKeyStyleContainer, ...ageKeyStyleContainerHover})} onMouseLeave={()=>setDynamicStyle({...ageKeyStyleContainer})}>
    {text}
    <AgeKeyIconSVG age={ageThreshold || 18} />
    <AgeKeyTextSVG />
    {isLoading && <div style={{...ageKeyLoaderContainer}}>
      <span style={{...ageKeyLoader}}/>
    </div>}
  </div>
}

