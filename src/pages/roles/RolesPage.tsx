import { useEffect, useState } from 'react';
import { Roles } from '../../types/rolesType';
//import { getAllRoles, submitRoles } from '../../services/RolesService';
//import { UserRoles} from '../../types/rolesType';
import { Title } from '../../components/atoms/Title/Ttile';
import { Button } from '../../components/atoms/Button/Button';
/*
export const RolesPage = () => {
  const [Roles, setRoles] = useState<Roles[]>([]);
  const [loading, setLoading] = useState(true);
  const [Permissions, setPermission] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        //const roles = await getAllRoles();
        //setRoles(roles);
      } catch (error) {
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleOptionChange = (rol_id: string, permissionsId: string, checked: boolean) => {
    setPermission(prev => {
      const prevSelected = prev[rol_id] || [];
      let updated: string[];
      if (checked) {
        updated = [...prevSelected, permissionsId];
      } else {
        updated = prevSelected.filter(id => id !== permissionsId);
      }
      return { ...prev, [rol_id]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const formattedRoles: UserRoles[] = Roles.map(q => ({
        rol_id: q.rolId,
        selected_permissions: Permissions[q.rolId] || []
      }));
      const result = await submitRoles(formattedRoles);
      setSubmitResult(result);
    } catch (error: any) {
      setSubmitResult(error?.message || "Error al enviar respuestas");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="col 12">
      <center>
        <Title variant='h2' color='success'>Roles</Title>
        <p>Esta es la página de Roles.</p>
        {loading ? (
          <p>Cargando roles...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <ul style={{ textAlign: "left", display: "inline-block" }}>
              {Roles.map((q) => (
                <li key={q.rolId} style={{ marginBottom: "1.5rem" }}>
                  <strong>{q.rolName}</strong>
                  <ul>
                    {q.permissions.map((c) => (
                      <li key={c.permissionId}>
                        <label>
                          <input
                            type="checkbox"
                            value={c.permissionId}
                            checked={Permissions[q.rol_id]?.includes(c.permission_id) || false}
                            onChange={e =>
                              handleOptionChange(q.rol_id, c.permission_id, e.target.checked)
                            }
                          />
                          {" "}{c.permission_name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar respuestas"}
            </Button>
            {submitResult && <p>{submitResult}</p>}
          </form>
        )}
      </center>
    </div>
  );
};*/