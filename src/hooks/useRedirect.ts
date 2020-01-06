import { useEffect } from "react";

const useRedirect = (acceptedHosts: string[], redirectHostname: string) => {
  useEffect(() => {
    const currentHostname = window.location.hostname;
    if (![...acceptedHosts, redirectHostname].includes(currentHostname)) {
      window.location.href =
        "https://" + redirectHostname + window.location.pathname;
    }
  });
};

export default useRedirect;
