
import axios from 'axios';
import Auth from 'Auth';
import { useState } from 'react';
import { Card, Form, Button, Input } from 'reactstrap';
import { Error } from 'components';
import { Link } from 'react-router-dom';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const usernameChanged = (event) => {
    setUsername(event.target.value);
    setError('');
  }

  const passwordChanged = (event) => {
    setPassword(event.target.value);
    setError('');
  }

  const formSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = {
        username,
        password
      }
  
      const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth`, data);
      Auth.login(result.data);

      props.history.push('/');

    } catch (error) {
      setError(error.response.data.message);
    }

  }

  return (
    <Card className="auth px-2 col-lg-4 col-sm-6">
      <Form onSubmit={formSubmit}>
        <h5 className="my-4" > تسجيل دخول</h5>
        <Error error={error} />

        <Input value={username} username="username" onChange={usernameChanged} placeholder="اسم االمستخدم" required />
        <Input type="password" value={password} password="password" onChange={passwordChanged} placeholder="كلمة المرور" required />

        <div>
          <Button color="primary" block className="mb-3 px-4" > تسجيل دخول</Button>
        </div>
        <small><Link to="/register"> إنشاء حساب</Link></small>

        <p className="m-3 text-muted">&copy; { new Date().getFullYear() }</p>
      </Form>
    </Card>
  );
}

export default Login;