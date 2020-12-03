import React from 'react';
import {motion} from "framer-motion";

const Switch = (props) => {
    const [isOn, setIsOn] = React.useState(false);

    const toggleSwitch = () => {
        props.action();
        setIsOn(!isOn);
    }

    return (
        <div
            style={{
                margin: "1rem",
                background: isOn ? "#F2764F" : "lightgray",
                display: "flex",
                justifyContent: isOn && "flex-end",
                width: "6rem",
                padding: "0.25rem",
                borderRadius: 9999,
                cursor: "pointer",
            }}
            onClick={toggleSwitch}
        >
                {/* Switch knob */}
            <motion.div
                style={{
                    width: "3rem",
                    height: "3rem",
                    background: "white",
                    borderRadius: "100%",
                    boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                layout
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}   
            ></motion.div>
        </div>
    );
}

export default Switch;

