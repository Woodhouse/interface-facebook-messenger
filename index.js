const bluebird = require('bluebird');
const messenger = require('facebook-chat-api');

class facebook {
    constructor() {
        this.name = 'facebook';
        this.displayname = 'Facebook Messenger';
        this.description = 'Send messages to woodhouse via Facebook Messenger';

        this.defaultPrefs = [{
            name: 'username',
            displayname: 'Username',
            type: 'text',
            value: ''
        },{
            name: 'password',
            displayname: 'Password',
            type: 'password',
            value: ''
        }];
    }

    init() {
        const prefs = [
                this.getPref('username'),
                this.getPref('password')
            ];

        bluebird.all(prefs).then((prefs) => {
            messenger({
                email: prefs[0],
                password: prefs[1]
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
