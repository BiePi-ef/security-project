import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Users() {
  const [role, setRole] = useState<String>(
    JSON.parse(localStorage.getItem("user") ?? "")?.role ?? ""
  )
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState< any[] | null>(null);


  useEffect(() => {
    setRole(JSON.parse(localStorage.getItem("user") ?? "")?.role ?? "");

    if (role && role === "admin") {
      const fetchUsers = async () => {
        setError(null);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:3001/users`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (!res.ok) {
            const body = await res.text();
            throw new Error(body || `HTTP ${res.status}`);
          }
          const data = await res.json();
          const user = data && data.userect ? data.userect : data;
          setUsers(user);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        }
      };
  
      fetchUsers();
    }
  }, []);




  return (
    <div className="browse-list">
      {Array.isArray(users) ? (
        users.map((user) => (
          <div>
            <p>{user.userName}</p>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <p>{user._id}</p>
            <p>{user.created_at}</p>
          </div>
        ))
      ) : (
        <div className="browse-info">Unexpected data format.</div>
      )}
    </div>
  )
}