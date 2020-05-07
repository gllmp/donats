import React from 'react';
import emailjs from 'emailjs-com';

class ContactForm extends React.Component {
    constructor(props) {
        super(props);

        this.sendEmail = this.sendEmail.bind(this);
    }

    componentDidMount() {
    
    }

    sendEmail(e) {
        e.preventDefault();
        
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
            <label>Email</label>
            <input type="email" name="user_email" />
            <label>Message</label>
            <textarea name="message" />
            <input type="submit" value="Send" />
            </form>
        );    
    }
}

export default ContactForm;