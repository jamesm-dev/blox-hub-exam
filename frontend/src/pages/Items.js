import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

function Items() {
  const { items, meta, fetchItems } = useData();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const isLoading = items.length === 0;

  useEffect(() => {
    fetchItems({ page, limit, q: query }).catch(console.error);
    return () => {};
  }, [fetchItems, page, limit, query]);

  const Row = useMemo(() => ({ index, style }) => {
    const item = items[index];
    return (
      <div style={style}>
        <Link to={'/items/' + item.id}>{item.name}</Link>
      </div>
    );
  }, [items]);

  const totalPages = meta?.totalPages || 1;

  return (
    <div className="container">
      <div className="toolbar">
        <input
          className="input"
          value={query}
          onChange={e => { setPage(1); setQuery(e.target.value); }}
          placeholder="Search..."
        />
        <select className="select" value={limit} onChange={e => { setPage(1); setLimit(parseInt(e.target.value, 10)); }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
        <List
          height={500}
          width={'100%'}
          itemCount={items.length}
          itemSize={36}
        >
          {({ index, style }) => (
            <div style={style} className="row">
              <Link to={'/items/' + items[index].id}>{items[index].name}</Link>
            </div>
          )}
        </List>
        </div>
      )}

      <div className="pagination">
        <button className="btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <span className="muted">Page {meta?.page || page} / {totalPages}</span>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </div>
  );
}

export default Items;