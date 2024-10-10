'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import DataDisplay from '../../components/DataDisplay';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('bottle_data')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching history:', error);
      } else {
        setHistory(data);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Analysis History</h1>
      <DataDisplay data={history} />
    </div>
  );
}