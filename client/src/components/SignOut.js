import React, { Component } from 'react';
import { DeletePublickey } from '../utils/localstorage';

class SignOut extends Component {
    componentDidMount = () => {
        this.props.loggedOut(false);
        DeletePublickey();
    }

    render() {
        return (
            <>
            </>
        );
    }
}

export default SignOut;
