import {Row} from 'reactstrap';
import { Avatar } from 'components';

const ContactHeader = (props) => {
  return (
    <Row className='heading'>
      <Avatar src={props.user.avatar}/>
      <div>جهات الاتصال</div>
      <div className='mr-auto nav-link' onClick={props.toggleShowProfileEdit}>
        <i className='fa fa-bars'/>
      </div>
    </Row>
  );
}

export default ContactHeader;