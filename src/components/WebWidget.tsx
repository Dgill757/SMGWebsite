
import React, { useEffect, useRef } from "react";

interface WebWidgetProps {
  widgetKey: string;
  size?: number;
  marginTop?: number;
  marginBottom?: number;
  align?: "center" | "left" | "right";
}

const WebWidget: React.FC<WebWidgetProps> = ({
  widgetKey,
  size = 220,
  marginTop = 100,
  marginBottom = 100,
  align = "center",
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the external widget script only once
    if (!document.querySelector('script[src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"]')) {
      const script = document.createElement("script");
      script.src = "https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Alignment styles
  let justifyClass = "justify-center";
  if (align === "left") justifyClass = "justify-start";
  if (align === "right") justifyClass = "justify-end";

  return (
    <div
      className={`flex ${justifyClass}`}
      style={{
        marginTop,
        marginBottom,
        width: "100%",
      }}
    >
      <div
        ref={widgetRef}
        data-widget-key={widgetKey}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export default WebWidget;
