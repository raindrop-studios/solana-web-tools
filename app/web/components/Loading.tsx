import { useState, useEffect } from 'react';

let timerType: ReturnType<typeof setInterval> | undefined;

function updateLoadingText(loadingText: string, setLoadingText: any, setTimerId: any, mounted: boolean) {
  console.log("updating loading - ", mounted);
  if (loadingText.includes("...")) {
    loadingText = "LOADING";
  } else {
    loadingText += ".";
  }
  if (mounted) {
    setLoadingText(loadingText);
    setTimerId(setTimeout(() => updateLoadingText(loadingText, setLoadingText, setTimerId, mounted), 1000));
  }
}

export default function Loading() {
  const [loadingText, setLoadingText] = useState("LOADING");
  const [loadingTimerId, setLoadingTimerId] = useState(timerType);

  useEffect(() => {
    let mounted = true;
    setLoadingTimerId(setTimeout(() => updateLoadingText("LOADING", setLoadingText, setLoadingTimerId, mounted), 1000));
    return function cleanup() {
      console.log("cleanup")
      mounted = false
      if (loadingTimerId) {
        clearTimeout(loadingTimerId);
      }
    }
  }, []);

  return (
    <span className="mt-auto mb-auto text-5xl">{loadingText}</span>
  )
}