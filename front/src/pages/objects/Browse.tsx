import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Browse.css';

type BrowseObj = {
  _id: string;
  name: string;
  category?: string;
  search_tags?: string[];
  visibility?: 'public' | 'private' | string;
  description?: string;
};

export default function Browse() {
  const [items, setItems] = useState<BrowseObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const fetchObjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');

        const params = new URLSearchParams();
        params.set('filter', filter);
        const url = `http://localhost:3001/objects?${params.toString()}`;

        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const body = await res.text();
          if (res.status === 401) {
            throw new Error("You must be authenticated to access to this functionality");
          }
          throw new Error(body || `HTTP ${res.status}`);
        }
        
        const data = await res.json();
        // server may return an array directly or an object wrapping the array
        if (Array.isArray(data)) {
          setItems(data);
        } else if (data && Array.isArray((data as any).objects)) {
          setItems((data as any).objects);
        } else if (data && Array.isArray((data as any).results)) {
          setItems((data as any).results);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [filter]);

  // client side filtering + search across name, category, search_tags
  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      if (!it) return false;
      const name = (it.name || '').toString().toLowerCase();
      const cat = (it.category || '').toString().toLowerCase();
      const search_tags = (it.search_tags || []).map((t) => t.toString().toLowerCase()).join(' ');
      return name.includes(q) || cat.includes(q) || search_tags.includes(q);
    });
  }, [items, debouncedQuery]);

  return (
    <div className="browse-container">
      <div className="browse-controls">
        <div className="browse-controls-inner">
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="browse-select">
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <input
            placeholder="Search by name, category or tag"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="browse-search"
          />
        </div>
      </div>

      <div className="browse-list-wrapper">
        {loading && <div className="browse-info">Loading...</div>}
        {error && <div className="browse-info browse-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="browse-info">No objects found.</div>
        )}

        <div className="browse-list">
          {Array.isArray(filtered) ? (
            filtered.map((obj) => (
              <Link key={obj._id} to={`/objects/${obj._id}`} className="browse-card-link">
                <div className="browse-card">
                  <div className="browse-card-header">
                    <h3 className="browse-card-title">{obj.name}</h3>
                    <small className="browse-card-visibility">{obj.visibility ?? 'public'}</small>
                  </div>
                  <div className="browse-card-category">{obj.category}</div>
                  {obj.search_tags && obj.search_tags.length > 0 && (
                    <div className="browse-card-search_tags">
                      {obj.search_tags.map((t) => (
                        <span key={t} className="browse-tag">{t}</span>
                      ))}
                    </div>
                  )}
                  {obj.description && <p className="browse-card-desc">{obj.description}</p>}
                </div>
              </Link>
            ))
          ) : (
            <div className="browse-info">Unexpected data format.</div>
          )}
        </div>
      </div>
    </div>
  );
}

