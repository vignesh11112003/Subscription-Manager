import { Search, SlidersHorizontal, X } from 'lucide-react';

import './SearchFilter.css';

function SearchFilter({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}) {
  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
    onStatusChange('All');
  };

  const hasFilters =
    searchTerm !== '' || category !== 'All' || status !== 'All';

  return (
    <div className="search-filter-container">
      <div className="search-input-wrapper">
        <Search size={19} className="search-icon" />

        <input
          type="search"
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search subscriptions"
        />

        {searchTerm && (
          <button
            type="button"
            className="clear-search-button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-label">
          <SlidersHorizontal size={17} />
          <span>Filters</span>
        </div>

        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Music">Music</option>
          <option value="Productivity">Productivity</option>
          <option value="Cloud Storage">Cloud Storage</option>
          <option value="Education">Education</option>
          <option value="Gaming">Gaming</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchFilter;
