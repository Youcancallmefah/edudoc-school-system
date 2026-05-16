'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState('กำลังทดสอบ...');

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) setStatus('❌ Error: ' + error.message);
      else setStatus(`✅ เชื่อมต่อสำเร็จ! เจอ ${data?.length ?? 0} นักเรียน`);
    }
    test();
  }, []);

  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      <h1>Supabase Test</h1>
      <p>{status}</p>
    </div>
  );
}