import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { EResources } from '@/entities';

export default function Check2014Data() {
  const [data, setData] = useState<EResources[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { items } = await BaseCrudService.getAll<EResources>('E-Resources');
        console.log('All E-Resources data:', items);
        
        const year2014Data = items.find(item => item.title === '2014-15');
        console.log('2014-15 data:', year2014Data);
        
        setData(items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">E-Resources Data Check</h1>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item._id} className="border p-4 rounded">
            <h2 className="font-bold">Title: {item.title}</h2>
            <p>ID: {item._id}</p>
            <p>E-Journals: {item.eJournals || 'N/A'}</p>
            <p>E-Books: {item.eBooks || 'N/A'}</p>
            <p>Resource List: {item.resourceList || 'N/A'}</p>
            <p>Language Labs: {item.languageLabsAndElearning || 'N/A'}</p>
            <p>Plagiarism Software: {item.plagiarismDetectionSoftware || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}