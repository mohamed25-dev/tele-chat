import React from "react";
import Contact from "./Contact";
import { Row, Input } from 'reactstrap';

class Contacts extends React.Component {

  state = { search: '' };

  onSearch = e => this.setState({ search: e.target.value });

  render() {
    return (
      <div className="list">
        <Row className="search">
          <Input onChange={this.onSearch} placeholder="بحث" />
        </Row>

        <Row id="contacts">
          {this.props.contacts.map((contact, index) => this.renderContact(contact, index))}
        </Row>
      </div>
    );
  }

  renderContact = (contact, index) => {
    if (!contact.name.includes(this.state.search)) return;
    const messages = this.props.messages.filter(e => e.sender === contact._id || e.receiver === contact._id);
    const lastMessage = messages[messages.length - 1];
    const unseen = messages.filter(message => !message.seen && message.sender === contact._id).length;
    
    return (
      <div className="w-100" 
        key={index} 
        onClick={this.props.onChatNavigate.bind(this, contact)} >
          <Contact 
            contact={contact} 
            message={lastMessage} 
            unseen={unseen} />
      </div>
    );
  }
}

export default Contacts;