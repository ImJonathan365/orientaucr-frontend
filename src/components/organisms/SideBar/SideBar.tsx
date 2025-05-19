
// CAMBIAR TODOS LOS LI POR LOS COMPONENTES QUE EL USUARIO TIENE PERMISO
export default function SideBar() {
  return (
    <div className="sidebar">
      <ul>
        <li><a>Home</a></li>
        <li><a>Careers</a></li>
        <li><a>Events</a></li>
        <li><a>Vocational Test</a></li>
        <li><a>Simulation Test</a></li>
      </ul>
    </div>
  );
}