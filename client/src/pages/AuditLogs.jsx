import React, { useState, useEffect, useCallback, useRef } from 'react';

const CATEGORIES = ["Contract", "Obligation", "User", "Approval", "Security", "Auth"];

const AVATAR_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function timeAgo(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'less than a minute ago';
  if (minutes < 60) return `about ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `about ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const categoryClass = (category) => `badge-category badge-category--${category.toLowerCase()}`;

const PAGE_SIZE = 15;

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const filterRef = useRef(null);

  // Debounce search input -> search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const buildQuery = useCallback((pageNum) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (activeCategories.length) params.set('category', activeCategories.join(','));
    params.set('page', String(pageNum));
    params.set('page_size', String(PAGE_SIZE));
    return params.toString();
  }, [search, activeCategories]);

  const fetchLogs = useCallback(async (pageNum, append) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const res = await fetch(`/api/audit-logs/?${buildQuery(pageNum)}`);
      const data = await res.json();
      setLogs(prev => append ? [...prev, ...data.logs] : data.logs);
      setTotal(data.total);
      setHasMore(data.has_more);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildQuery]);

  // Refetch from page 1 whenever search or filters change
  useEffect(() => {
    fetchLogs(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeCategories]);

  const toggleCategory = (cat) => {
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (activeCategories.length) params.set('category', activeCategories.join(','));
    window.open(`/api/audit-logs/export?${params.toString()}`, '_blank');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--primary-color)' }}>Audit Logs</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
            Immutable trail of every user action and system event
          </p>
        </div>
        <button className="premium-button" style={{ width: 'auto', padding: '12px 24px' }} onClick={handleExport}>
          <i className="fa-solid fa-file-export" style={{ marginRight: '8px' }}></i> Export CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <i className="fa-solid fa-magnifying-glass" style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-secondary)', fontSize: '14px'
          }}></i>
          <input
            type="text"
            className="premium-input"
            placeholder="Search actor, action, or target"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        <div style={{ position: 'relative' }} ref={filterRef}>
          <button
            className="premium-button"
            style={{
              width: 'auto', padding: '0 20px', height: '100%',
              backgroundColor: activeCategories.length ? 'var(--primary-color)' : 'var(--background-white)',
              color: activeCategories.length ? '#fff' : 'var(--text-primary)',
              border: '1px solid var(--border-color)', boxShadow: 'none'
            }}
            onClick={() => setFilterOpen(o => !o)}
          >
            <i className="fa-solid fa-filter" style={{ marginRight: '8px' }}></i>
            Filter {activeCategories.length > 0 && `(${activeCategories.length})`}
          </button>

          {filterOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 10,
              background: 'var(--background-white)', border: '1px solid var(--border-color)',
              borderRadius: '10px', boxShadow: 'var(--shadow-lg)', padding: '12px', minWidth: '200px'
            }}>
              {CATEGORIES.map(cat => (
                <label key={cat} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 6px', cursor: 'pointer', fontSize: '14px'
                }}>
                  <input
                    type="checkbox"
                    checked={activeCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className={categoryClass(cat)}>{cat}</span>
                </label>
              ))}
              {activeCategories.length > 0 && (
                <button
                  onClick={() => setActiveCategories([])}
                  style={{
                    marginTop: '8px', width: '100%', background: 'none', border: 'none',
                    color: 'var(--danger-color)', fontSize: '13px', cursor: 'pointer', padding: '6px'
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="premium-table-container" style={{ padding: '8px 0' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading activity...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No matching audit log entries.
          </div>
        ) : (
          <div>
            <div style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Activity Timeline
            </div>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 24px', borderTop: '1px solid var(--border-color)'
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: getAvatarColor(log.actor), color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: '13px', flexShrink: 0
                }}>
                  {getInitials(log.actor)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ fontWeight: 600 }}>{log.actor}</span>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{log.action}</span>{' '}
                    <span style={{ fontWeight: 600 }}>{log.target}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {timeAgo(log.timestamp)} · IP {log.ip}
                  </div>
                </div>

                <span className={categoryClass(log.category)}>{log.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && hasMore && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            className="premium-button"
            style={{ width: 'auto', padding: '10px 24px', backgroundColor: 'var(--background-white)', color: 'var(--primary-color)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
            onClick={() => fetchLogs(page + 1, true)}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : `Load more (${logs.length} of ${total})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
