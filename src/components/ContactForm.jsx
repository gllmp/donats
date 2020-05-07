import React from 'react';
import emailjs from 'emailjs-com';

class ContactForm extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     user_email: "",
        //     contact_number: "",
        //     user_name: "",
        //     message: ""
        // };

        this.sendEmail = this.sendEmail.bind(this);
    }

    componentDidMount() {
    
    }

    sendEmail(e) {
        e.preventDefault();

        //console.log("EMAIL: ", this.state);
        
        emailjs.sendForm(process.env.REACT_APP_EMAILJS_SERVICEID, process.env.REACT_APP_EMAILJS_TEMPLATEID, e.target, process.env.REACT_APP_EMAILJS_USERID)
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    }

    render() {
        return (
            <form className="contact-form" onSubmit={this.sendEmail}>
            <input type="hidden" name="contact_number" />
            <label>Name</label>
            <input type="text" name="user_name" />
            {/* <input type="text" name="user_name" onChange={e => this.setState({user_name: e.target.value})} /> */}
            <label>Email</label>
            <input type="email" name="user_email" />
            {/* <input type="email" name="user_email" onChange={e => this.setState({user_email: e.target.value})} /> */}
            <label>Message</label>
            <textarea name="message" />
            {/* <textarea name="message" onChange={e => this.setState({message: e.target.value})} /> */}
            <input type="submit" value="Send" />
            </form>
        );    
    }
}

export default ContactForm;