
import React, { useEffect, useRef } from "react";

interface WebWidgetProps {
  widgetKey: string;
  size?: number;
  marginTop?: number;
  marginBottom?: number;
  align?: "center" | "left" | "right";
  welcomeText?: string;  // Add a new optional prop for welcome text
}

const WebWidget: React.FC<WebWidgetProps> = ({
  widgetKey,
  size = 220,
  marginTop = 100,
  marginBottom = 100,
  align = "center",
  welcomeText = "Welcome to Our Service How can we help you today?",  // Default text with fallback
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
        data-welcome-text={welcomeText}  // Add welcome text as a data attribute
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export default WebWidget;
