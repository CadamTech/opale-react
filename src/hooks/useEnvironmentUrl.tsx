import { useEffect, useState } from "react";

const baseApiUrlDev = import.meta.env.VITE_OPALE_API_URL_DEV;
const authUrlDev = import.meta.env.VITE_OPALE_AUTH_URL_DEV;

const baseApiUrlStage = import.meta.env.VITE_OPALE_API_URL_STAGE
const authUrlStage = import.meta.env.VITE_OPALE_AUTH_URL_STAGE

const baseApiUrlProd = import.meta.env.VITE_OPALE_API_URL_PROD
const authUrlProd = import.meta.env.VITE_OPALE_AUTH_URL_PROD

type UseEnvironmentUrlsReturn = {
  baseApiUrl: string;
  authUrl: string;
}

export const useEnvironmentUrls = (publicKey: string): UseEnvironmentUrlsReturn => {
  // Determine the correct URLs immediately based on publicKey
  const [environmentUrls, setEnvironmentUrls] = useState<UseEnvironmentUrlsReturn>({
    baseApiUrl: "",
    authUrl: ""
  })

  useEffect(() => {
    if(!publicKey) return
    if (publicKey.startsWith("dev-")) {
      setEnvironmentUrls({ baseApiUrl: baseApiUrlDev, authUrl: authUrlDev });
    } else if (publicKey.startsWith("staging-")) {
      setEnvironmentUrls({ baseApiUrl: baseApiUrlStage, authUrl: authUrlStage });
    } else {
      setEnvironmentUrls({ baseApiUrl: baseApiUrlProd, authUrl: authUrlProd });
    }
  }, [publicKey])

  return environmentUrls
};