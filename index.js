var bluebird = require('bluebird'),
    messenger = bluebird.promisify(require('facebook-chat-api')),
    facebook = function(){
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
    };

facebook.prototype.init = function(){
    this.getPrefs().done(function(prefs){
        this.prefs = prefs;
        this.connect();
    }.bind(this));
}

facebook.prototype.connect = function() {
    messenger({
        email: this.prefs.username,
        password: this.prefs.password
    }, {
        logLevel: 'silent'
    }).then(function(api) {
        this.api = api;

        this.api.listen(function(err, message) {
            this.messageRecieved(message.threadID, message.body, message.senderID);
            this.api.markAsRead(message.threadID)
        }.bind(this));

        this.addMessageSender(function(message, to) {
            this.api.sendMessage(message, to);
        }.bind(this));
    }.bind(this));
}

facebook.prototype.exit = function(){
    if (this.api) {
        this.api.logout();
    }
}

module.exports = facebook;
