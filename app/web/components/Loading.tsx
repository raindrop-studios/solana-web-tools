import { useState, useEffect } from 'react';

function updateLoadingText(startingLoadingText: string, loadingText: string, setLoadingText: any, finished: any) {
  if (loadingText.includes("...")) {
    loadingText = startingLoadingText;
  } else {
    loadingText += ".";
  }
  if (setLoadingText) {
    setLoadingText(loadingText);
    return finished(loadingText, setLoadingText, finished);
  }
}

const DEFAULT_LOADING = "LOADING";
export default function Loading(props : { text?: string } = { text: DEFAULT_LOADING }) {
  const [loadingText, setLoadingText] = useState(props.text || DEFAULT_LOADING);

  useEffect(() => {
    let mounted = true;
    const loading = async (loadingText: string, setLoadingText: any, finished: any) => {
      await new Promise(r => setTimeout(r, 1000));
      if (mounted) {
        updateLoadingText(props.text || DEFAULT_LOADING, loadingText, setLoadingText, finished);
      }
    }
    if (mounted) {
      loading(loadingText, setLoadingText, loading)
    }
    return function cleanup() {
      mounted = false;
    }
  }, []);

  return (
    <span className="mt-auto mb-auto text-5xl">{loadingText}</span>
  )
}