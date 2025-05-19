import { Link } from 'react-router-dom';

export default function PublicHomePage () {
  return (
    <div>
      <ul>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Registro</Link></li>
      </ul>
    </div>
  );
}