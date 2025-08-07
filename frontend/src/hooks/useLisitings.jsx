import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllListings } from '../services/api';

const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();


  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllListings(location, page,8); // Assume this API supports pagination
      const newListings = Array.isArray(data) ? data : data.listings || [];

      // Append new listings
setListings((prev) => {
  const existingIds = new Set(prev.map((l) => l._id));
  const uniqueNewListings = newListings.filter((l) => !existingIds.has(l._id));
  return [...prev, ...uniqueNewListings];
});
      // If fewer items returned than expected, stop further loading
      setHasMore(newListings.length > 0);
      setError('');
    } catch (err) {
      if (err.isUnauthorized) {
        navigate('/auth/login');
      }
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, [location, page, navigate]);


  // Reset listings on location change
  useEffect(() => {
    setListings([]);
    setPage(1);
    setHasMore(true);
  }, [location]);

  useEffect(() => {
  if (page === 1) {
    fetchListings();
  }
}, [location, fetchListings, page]);


  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    loading,
    error,
    hasMore,
    setLocation,
    setPage,
  };
};

export default useListings;
