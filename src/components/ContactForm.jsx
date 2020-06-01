import React from 'react';
import emailjs from 'emailjs-com';

class ContactForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showContact: false
        };

        this.onShowContact = this.onShowContact.bind(this);
        this.onCloseContact = this.onCloseContact.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    componentDidMount() {
    
    }

    onShowContact() {
        this.setState({
            showContact: true
        });
    }

    onCloseContact() {
        this.setState({
            showContact: false
        });
    }

    sendEmail(e) {
        e.preventDefault();
        
        emailjs.sendForm(process.env.REACT_APP_EMAILJS_SERVICEID, process.env.REACT_APP_EMAILJS_TEMPLATEID, e.target, process.env.REACT_APP_EMAILJS_USERID)
        .then((result) => {
            console.log(result.text);
            window.alert(`Message envoyé avec succès :)`);
        }, (error) => {
            console.log(error.text);
            window.alert(`L'envoi du message a échoué :(`);
        });
    }

    render() {
        return (
            <div id="contact-container">
                <div id="contact-text">
                    <h1>Écrivez-nous</h1>
                    <p>
                        Envoyez-nous vos commentaires,<br/>
                        questions ou juste un bonjour !<br/>
                        Écrivez-nous à partir du formulaire<br/>
                        ou envoyez un e-mail à <a href="mailto:bonjour@donats.net">bonjour@donats.net</a>
                    </p>
                </div>
                <div id="contact-form">
                    <form className="contact-form" onSubmit={this.sendEmail}>
                        {/* <input type="hidden" name="contact_number" /> */}
                        <input id="contact-name" type="text" name="user_name" placeholder="Nom" />
                        <input id="contact-email" type="email" name="user_email" placeholder="Email" />
                        <textarea id="contact-message" name="message" placeholder="Votre message" />
                        <input id="contact-button" type="submit" value="Envoyer" />
                    </form>
                </div>
            </div>
        );    
    }
}

export default ContactForm;