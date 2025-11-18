import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { EResources } from '@/entities';

export default function Check2014Data() {
  const [data, setData] = useState<EResources[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await BaseCrudService.getAll<EResources>('E-Resources');
        console.log('All E-Resources data:', result.items);
        
        // Filter for 2014-15 data
        const year2014Data = result.items.filter(item => 
          item.title === '2014-15' || 
          item.title?.includes('2014') ||
          item._id?.includes('2014')
        );
        
        console.log('2014-15 filtered data:', year2014Data);
        setData(result.items);
      } catch (err) {
        console.error('Error fetching E-Resources data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Checking 2014-15 E-Resources Data...</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const year2014Data = data.filter(item => 
    item.title === '2014-15' || 
    item.title?.includes('2014')
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">E-Resources Data Check</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All E-Resources Entries ({data.length} total):</h2>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item._id} className="border p-4 rounded">
              <p><strong>Index:</strong> {index}</p>
              <p><strong>ID:</strong> {item._id}</p>
              <p><strong>Title:</strong> {item.title || 'No title'}</p>
              <p><strong>Created:</strong> {item._createdDate ? new Date(item._createdDate).toLocaleDateString() : 'No date'}</p>
              {item.eJournals && <p><strong>E-Journals:</strong> {item.eJournals.substring(0, 100)}...</p>}
              {item.eBooks && <p><strong>E-Books:</strong> {item.eBooks.substring(0, 100)}...</p>}
              {item.resourceList && <p><strong>Resource List:</strong> {item.resourceList.substring(0, 100)}...</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2014-15 Specific Data ({year2014Data.length} entries):</h2>
        {year2014Data.length > 0 ? (
          <div className="space-y-4">
            {year2014Data.map((item) => (
              <div key={item._id} className="border p-4 rounded bg-yellow-50">
                <p><strong>ID:</strong> {item._id}</p>
                <p><strong>Title:</strong> {item.title}</p>
                <p><strong>Created:</strong> {item._createdDate ? new Date(item._createdDate).toLocaleDateString() : 'No date'}</p>
                
                {item.eJournals && (
                  <div className="mt-2">
                    <strong>E-Journals:</strong>
                    <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded mt-1">{item.eJournals}</pre>
                  </div>
                )}
                
                {item.eBooks && (
                  <div className="mt-2">
                    <strong>E-Books:</strong>
                    <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded mt-1">{item.eBooks}</pre>
                  </div>
                )}
                
                {item.resourceList && (
                  <div className="mt-2">
                    <strong>Resource List:</strong>
                    <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded mt-1">{item.resourceList}</pre>
                  </div>
                )}
                
                {item.languageLabsAndElearning && (
                  <div className="mt-2">
                    <strong>Language Labs & E-Learning:</strong>
                    <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded mt-1">{item.languageLabsAndElearning}</pre>
                  </div>
                )}
                
                {item.plagiarismDetectionSoftware && (
                  <div className="mt-2">
                    <strong>Plagiarism Detection Software:</strong>
                    <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded mt-1">{item.plagiarismDetectionSoftware}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No 2014-15 data found in CMS</p>
        )}
      </div>
    </div>
  );
}