import React, { Component } from 'react';
import styled from 'styled-components';

import logo from '../assets/img/quarantine-logo.gif';

const Wrapper = styled.a.attrs({
    className: 'navbar-brand',
})``

class Logo extends Component {
    render() {
        return (
            <Wrapper href="/">
                <img src={logo} width="120" height="67" alt="logo" />
            </Wrapper>
        )
    }
}

export default Logo;
