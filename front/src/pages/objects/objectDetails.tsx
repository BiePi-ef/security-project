import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ObjectDetails.css';

type Obj = {
  _id: string;
  name: string;
  options: any;
  category?: string;
  search_tags?: string[];
  visibility?: string;
  description?: string;
  author?: string;
  created_at?: string;
  last_updated_at?: string[];
};

// Recursively render any nested data structure
const RenderNested = ({ data, depth = 0 }: { data: any; depth?: number }) => {
  if (data === null || data === undefined ) {
    return <span className="nested-null">—</span>;
  }

  if (typeof data !== 'object' ) {
    return <span className="nested-primitive">{String(data)}</span>;
  }

  if (Array.isArray(data)) {
    return (
      <div className={`nested-array nested-depth-${depth}`}>
        {data.length === 0 ? (
          <span className="nested-empty">[]</span>
        ) : (
          <ul className="nested-list">
            {data.map((item, idx) => {
                return (
                  <li key={idx}>
                    <RenderNested data={item} depth={depth + 1} />
                  </li>
                )
              }
            )}
          </ul>
        )}
      </div>
    );
  }

  // Object case
  return (
    <div className={`nested-object nested-depth-${depth}`}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="nested-entry">
          <span className="nested-key">{key}</span>
          <span className="nested-separator">:</span>
          <div className="nested-value">
            <RenderNested data={value} depth={depth + 1} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ObjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Obj | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOne = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3001/objects/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.status === 404) {
          setError('Object not found');
          setItem(null);
          return;
        }
        if (!res.ok) {
          const body = await res.text();
          throw new Error(body || `HTTP ${res.status}`);
        }
        const data = await res.json();
        const obj = data && data.object ? data.object : data;
        setItem(obj);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);
  
  return (
    <div className="object-details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      {loading && <div className="info">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && !item && <div className="info">No object to display.</div>}

      {item && (
        <div className="object-card">
          <h2 className="object-title">{item.name}</h2>

            <div className="object-tags-subtitle">
              <span className="field-label">search_tags</span>
                {item.search_tags && item.search_tags.length > 0 ? (
                  <span className="field-value">
                    {item.search_tags?.join(", ")}
                  </span>
                ) : (
                  <span>none</span>
                )}
            </div>

          {item.category && (
            <div className="object-field">
              <span className="field-label">Category</span>
              <span className="field-value">{item.category}</span>
            </div>
          )}

          {/* Additional fields (options) */}
          {item.options && (
            <div className="object-field">
              <span className="field-label">Options</span>
              <div className="field-value">
                <RenderNested data={item.options} />
              </div>
            </div>
          )}
          <div className="object-field">
            <span className="field-label">Author</span>
            <span className="field-value">{item.author}</span>
          </div>

          <div className="object-timestamps">
              <div className="timestamp-row">
                <span>Last modified: {
                  (item.last_updated_at && item.last_updated_at?.length > 0)
                   ? item.last_updated_at[item.last_updated_at.length - 1] 
                   : item.created_at }</span>
              </div>
              <div className="timestamp-row">
                <span>Created: {item.created_at}</span>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
