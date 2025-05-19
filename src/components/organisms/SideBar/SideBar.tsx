import { Link } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

export default function SideBar() {
  const { user } = useUser();


  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/career-list">Careers</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/vocational-test">Vocational Test</Link></li>
        <li><Link to="/simulation-test">Simulation Test</Link></li>
      </ul>
    </div>
  );
}