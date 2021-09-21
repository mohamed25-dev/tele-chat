import React from 'react';
import { Row, Spinner } from 'reactstrap';
import { ContactHeader, 
  Contacts, 
  ChatHeader, 
  Messages, 
  MessageForm, 
  UserProfile,
  EditProfile
} from 'components';
import io from 'socket.io-client';
import Auth from 'Auth';

class Chat extends React.Component {
  state = {
    contacts: [],
    messages: [],
    contact: {},
    showProfile: false,
    showProfileEdit: false
  };

  onChatNavigate = contact => {
    this.setState({ contact })
    this.state.socket.emit('seen', contact._id);

    let messages = this.state.messages;
    messages.forEach((message, index) => {
      if (message.sender === contact._id) messages[index].seen = true;
    });

    this.setState({messages});
  }

  intiSocketConnection = () => {
    const socket = io(process.env.SOCKET_URL, {
      query: `token=${Auth.getToken()}`
    });

    this.setState({socket});

    socket.on('connect', () => {
      this.setState({connected: true});
    });
    
    socket.on('data', (user, contacts, messages, users) => {
      const contact = contacts[0] || {};
      this.setState({ user, contact, contacts, messages}, () => {
          this.updateUserState(users);
      });
    });

    socket.on('message', (message) => {
      if (message.sender === this.state.contact._id) {
        this.setState({typing: false});
        this.state.socket.emit('seen', this.state.contact._id);

        message.seen = true;
      }

      const messages = this.state.messages.concat(message);
      this.setState({messages});
    });

    socket.on('disconnect', () => {
      this.setState({connected: false});
    });

    socket.on('new_user', (contact) => {
      this.setState({
        contacts: this.state.contacts.concat(contact)
      });
    });

    socket.on('user_status', (users) => {
      this.updateUserState(users);
    });

    socket.on('user_updated', (user) => {
      this.onUpdateUser(user);
    });

    socket.on('new_message', (message) => {
      this.setState({
        messages: this.state.messages.concat(message)
      });
    });

    socket.on('typing', this.onTypingMessage);
    

    socket.on('error', err => {
      if (err === 'Unauthenticated') {
        Auth.logout();
        this.props.histroy.push('/'); 
      }
    });
  }

  onUpdateUser = (user) => {
    if (this.state.user._id === user._id) {
      this.setState({user});
      Auth.setUser(user)
      
      return;
    }

    const contacts = this.state.contacts;
    
    contacts.forEach((contact, index) => {
      if (contact._id === user._id) {
        contacts[index] = user;
        contacts[index].status = contact.status;
      }
    });

    this.setState({contacts});

    if (this.state.contact._id === user._id ) {
      this.setState({contact: user});
    }
  }

  onTypingMessage = (sender) => {
    if (this.state.contact._id !== sender) return;
    this.setState({typing: sender});

    clearTimeout(this.state.timeout);
    const timeout = setTimeout(this.typingTimeout, 3000);
    this.setState({timeout});
  }

  typingTimeout = () => this.setState({typing: false});

  sendMessage = (message) => {
    if (!this.state.contact._id) return;

    message.receiver = this.state.contact._id;
    const messages = this.state.messages.concat(message);

    this.setState({messages});
    this.state.socket.emit('message', message);
  }

  sendTyping = () => {
    this.state.socket.emit('typing', this.state.contact._id);
  }

  componentDidMount () {
    this.intiSocketConnection();
  }

  updateUserState = (users) => {
    let contacts = this.state.contacts;

    contacts.forEach((contact, index) => {
      if (users[contact._id]) {
        contacts[index].status = users[contact._id]
      }
    });

    this.setState({contacts});

    const contact = this.state.contact;
    if (users[contact._id]) {
      contact.status = users[contact._id];
    }

    this.setState({contact});
  }

  toggleShowProfile = () => {
    this.setState({
      showProfile: !this.state.showProfile
    });
  }

  toggleShowProfileEdit = () => {
    this.setState({
      showProfileEdit: !this.state.showProfileEdit
    });
  }

  render() {
    if (!this.state.connected || !this.state.user ) {
      return <Spinner id='loader' color='success'/>
    }

    return (
      <Row className="h-100">
        <div id="contacts-section" className="col-6 col-md-4" >
          <ContactHeader 
            user={this.state.user}
            toggleShowProfileEdit={this.toggleShowProfileEdit}
          />

          <Contacts
            contacts={this.state.contacts}
            messages={this.state.messages}
            onChatNavigate={this.onChatNavigate}
          />

          <UserProfile 
            contact={this.state.contact} 
            toggleShowProfile={this.toggleShowProfile} 
            open={this.state.showProfile}
          />

          <EditProfile 
            user={this.state.user} 
            toggleShowProfileEdit={this.toggleShowProfileEdit} 
            open={this.state.showProfileEdit}
          />
        </div>

        <div id="messages-section" className="col-6 col-md-8">
          <ChatHeader
            contact={this.state.contact}
            typing={this.state.typing}
            toggle={this.userProfileToggle}
            logout={this.logout} 
            toggleShowProfile={this.toggleShowProfile} 
          />
          
          {this.renderChat()}

          <MessageForm sender={this.sendMessage} sendTyping={this.sendTyping}/>
        </div>
      </Row>
    );
  }

  renderChat = () => {
    const { contact, user } = this.state;
    if (!contact) return;

    const messages = this.state.messages.filter(message => message.sender === contact._id || message.receiver === contact._id);
    return <Messages user={user} messages={messages} />
  };

}

export default Chat;