import { useEffect } from "react";

const AdComponent = () => {
  useEffect(() => {
    // Define the ad options
    (window as any).atOptions = {
      key: "2eeeeff5455b3188ce40853c09315767",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    // Create the script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//www.highperformanceformat.com/2eeeeff5455b3188ce40853c09315767/invoke.js";
    script.async = true;

    // Append script to the document body
    document.body.appendChild(script);

    return () => {
      // Cleanup: Remove script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h2>Advertisement</h2>
      {/* The ad will be loaded into this container */}
      <div id="ad-container"></div>
    </div>
  );
};

export default AdComponent;