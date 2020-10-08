import React, { createContext, useState } from "react";

export const InnerWidthContext = createContext();

export function InnerWidthProvider(props) {
    const [width, setWidth] = useState(window.innerWidth);

    return (
        <InnerWidthContext.Provider value={[width, setWidth]}>
            {props.children}
        </InnerWidthContext.Provider>
    );
}