import React from 'react';
import styled from "styled-components";

const CircleDiv = styled.div`
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 100%;
`

const Circle = (props) => {

    return (
        <CircleDiv style={{backgroundColor: `${props.color}`, cursor: "pointer"}}></CircleDiv>
    );
}

export default Circle;
