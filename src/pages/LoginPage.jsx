import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authenticationService } from '../services';
import loadingCircle from '../assets/img/loading-circle.gif'

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) { 
            this.props.history.push('/admin');
        }
    }

    componentDidMount() {
        require('bootswatch/dist/darkly/bootstrap.min.css')
        require('../components/Admin.css')
    }

    componentWillUnmount() {
      
    }

    render() {
        return (
            <div className="login-container">
                <a className="login-link" href="/"><h1 id="login-title">DONATS</h1></a>
                <div className="login-form">
                    <h2>Login</h2>
                    <Formik
                        initialValues={{
                            username: '',
                            password: ''
                        }}
                        validationSchema={Yup.object().shape({
                            username: Yup.string().required('Username is required'),
                            password: Yup.string().required('Password is required')
                        })}
                        onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
                            setStatus();
                            authenticationService.login(username, password)
                                .then(
                                    user => {
                                        const { from } = this.props.location.state || { from: { pathname: "/admin" } };
                                        this.props.history.push(from);
                                    },
                                    error => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                        }}
                    >
                        {({ errors, status, touched, isSubmitting }) => (
                            <Form className="mt-5">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <Field name="username" type="text" autoComplete="on" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                    <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Field name="password" type="password" autoComplete="on" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group mt-5">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
                                    <a href="/" className="btn btn-primary ml-4">Back</a>
                                    {isSubmitting &&
                                        <img className="loading-circle" alt="gif" src={loadingCircle} />
                                    }
                                </div>
                                {status &&
                                    <div className={'alert alert-danger'}>{status}</div>
                                }
                            </Form>
                        )}
                    </Formik>
                </div>
                <a className="login-link" href="/"><p id="login-back">← back to donats.net</p></a>
            </div>
        )
    }
}

export default LoginPage; 