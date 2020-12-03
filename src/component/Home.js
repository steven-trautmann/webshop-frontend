import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from "framer-motion";
import Circle from "./Circle";
import Switch from "./Switch";

const Home = () => {
    const [visibleTitle, setVisibleTitle] = useState(true);
    const [colors, setColors] = useState(["red", "orange", "yellow", "green", "blue", "indigo", "violet", "black", "gray"])
    const [originalColors, ] = useState(["red", "orange", "yellow", "green", "blue", "indigo", "violet", "black", "gray"])
    const [startSwitching, setStartSwitching] = useState(false);

    const toggleTitle = () => {
        setVisibleTitle(!visibleTitle);
    }

    const switchColors = () => {
        let itsTheOriginal = true;
        for (let i = 0; i < originalColors.length; i++){
            if (colors[i] !== originalColors[i]){
                itsTheOriginal = false;
                break;
            }
        }
        if (itsTheOriginal){
            setStartSwitching(true);
            setColors(shuffle(...colors));
        } else {
            setStartSwitching(false);
            setColors(originalColors);
        }
    }

    useEffect(() => {
        let interval = setInterval(() => {
            if (!startSwitching){
                clearInterval(interval);
            } else {
                setColors(shuffle(...colors));
            }
        }, 2000);

        return () => {clearInterval(interval);}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startSwitching])

    function shuffle(...array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }

    return (
        <div style={{textAlign: "center"}}>
            <button style={{
                marginBottom: visibleTitle ? "2rem" : "1rem",
                transition: "margin-bottom 1s",
                transitionDelay: visibleTitle ? "0s" : "0.55s"
            }}
                onClick={() => {toggleTitle()}}>
                Toggle Title
            </button>
            <AnimatePresence>
                {visibleTitle ?
                <motion.h1
                style={{
                    position: "absolute",
                    width: "28rem", 
                    top: "6rem", 
                    left: "50vw", 
                    translateX: "-50%",
                }}
                initial={{opacity: 0, y: "-1rem"}}
                animate={{opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5}}}
                exit={{opacity: 0, y: "20rem", transition: {duration: 0.5, delay: 0}}}
                >
                    Hello there, this is a simple title!
                </motion.h1>
                : null}
            </AnimatePresence>

            {/* circles */}
            <motion.div
                initial="initial"
                animate="animate"
                style={{
                    display: "flex", 
                    justifyContent: "space-around", 
                    alignItems: "center", 
                    flexWrap: "wrap",
                    marginTop: visibleTitle ? "2rem" : "1rem",
                    transition: "margin-top 1s",
                    transitionDelay: visibleTitle ? "0s" : "0.55s"
                }}
                variants={{
                    animate: {
                        transition: {
                        staggerChildren: 0.3,
                        }
                  }
                }} 
                >
                {colors.map((color) => {
                    return <motion.div
                    variants={{
                        initial: {
                            opacity: 0,
                            x: "-3rem",
                        },
                        animate: { 
                            transition: {duration: 0.3},
                            opacity: 1,
                            x: 0,
                      }
                    }}
                    drag dragConstraints={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                      }}
                    
                    key={color}>
                        <Circle color={color}></Circle>
                    </motion.div>
                })}
            </motion.div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <Switch action={switchColors}></Switch>
            </div>
        </div>
    );
}

export default Home;
