import { useEffect, useState } from "react";


export function useDeviceType() {
    const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) return setDeviceType("mobile")
            if (window.innerWidth < 1024) return setDeviceType("tablet")

            return setDeviceType("desktop");
        }

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("load", handleResize);
    }, []);

    return deviceType;
}
