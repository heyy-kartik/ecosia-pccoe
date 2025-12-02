"use client";

import { useEffect } from "react";

type Props = {
  widgetId: string; // The quiz ID from OpinionStage
  elementId?: string; // Optional custom div id
};

export default function OpinionStageEmbed({ widgetId, elementId }: Props) {
  useEffect(() => {
    if (document.getElementById("os-widget-jssdk")) return;

    const script = document.createElement("script");
    script.id = "os-widget-jssdk";
    script.async = true;
    script.src =
      "https://www.opinionstage.com/assets/loader.js?" +
      Math.floor(new Date().getTime() / 1000000);

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id={elementId || `os-widget-${widgetId}`}
      data-opinionstage-widget={widgetId}
    />
  );
}
