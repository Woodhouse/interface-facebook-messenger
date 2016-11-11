const messenger = require('facebook-chat-api');

class facebook {
    constructor() {
        this.name = 'facebook';
        this.displayname = 'Facebook Messenger';
        this.description = 'Send messages to woodhouse via Facebook Messenger';

        this.defaultPrefs = {
            username: {
                displayname: 'Username',
                type: 'text',
                value: ''
            },
            password: {
                displayname: 'Password',
                type: 'password',
                value: ''
            }
        };
    }

    init() {
        this.getAllPrefs().then((prefs) => {
            messenger({
                email: prefs.username.value,
                password: prefs.password.value
            }, {
                logLevel: 'silent'
            }, (err, api) => {
                api.listen((err, message) => {
                    this.messageRecieved(message.threadID, message.body, message.senderID);
                    api.markAsRead(message.threadID)
                });

                this.addMessageSender((to, message) =>{
                    api.sendMessage(message, to);
                });
            });
        });
    }
};

module.exports = facebook;
