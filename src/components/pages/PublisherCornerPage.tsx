import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, FileText, Users, Calendar, Upload } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

interface Publication {
  id: string;
  title: string;
  description: string;
  publishDate: Date;
  category: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  downloads: number;
}

export default function PublisherCornerPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [newPublication, setNewPublication] = useState<{
    title: string;
    description: string;
    category: string;
    status: 'draft' | 'published' | 'archived';
  }>({
    title: '',
    description: '',
    category: '',
    status: 'draft'
  });

  // Demo publications data
  const demoPublications: Publication[] = [
    {
      id: '1',
      title: 'Advanced Engineering Mathematics Handbook',
      description: 'Comprehensive guide covering calculus, linear algebra, and differential equations for engineering students.',
      publishDate: new Date('2024-10-15'),
      category: 'Mathematics',
      status: 'published',
      author: 'Dr. Rajesh Kumar',
      downloads: 1250
    },
    {
      id: '2',
      title: 'Digital Signal Processing Fundamentals',
      description: 'Essential concepts and practical applications of DSP in modern engineering systems.',
      publishDate: new Date('2024-09-28'),
      category: 'Electronics',
      status: 'published',
      author: 'Prof. Priya Sharma',
      downloads: 890
    },
    {
      id: '3',
      title: 'Sustainable Engineering Practices',
      description: 'Guidelines and methodologies for implementing sustainable practices in engineering projects.',
      publishDate: new Date('2024-11-02'),
      category: 'Environmental',
      status: 'draft',
      author: 'Dr. Arun Patel',
      downloads: 0
    },
    {
      id: '4',
      title: 'Machine Learning in Engineering Applications',
      description: 'Practical applications of ML algorithms in solving complex engineering problems.',
      publishDate: new Date('2024-08-20'),
      category: 'Computer Science',
      status: 'published',
      author: 'Dr. Meera Singh',
      downloads: 2100
    }
  ];

  useEffect(() => {
    setPublications(demoPublications);
  }, []);

  const handleAddPublication = () => {
    if (!newPublication.title || !newPublication.description) return;

    const publication: Publication = {
      id: Date.now().toString(),
      ...newPublication,
      publishDate: new Date(),
      author: user?.username || 'Unknown',
      downloads: 0
    };

    setPublications(prev => [publication, ...prev]);
    setNewPublication({ title: '', description: '', category: '', status: 'draft' });
    setIsAddModalOpen(false);
  };

  const handleEditPublication = (publication: Publication) => {
    setEditingPublication(publication);
    setNewPublication({
      title: publication.title,
      description: publication.description,
      category: publication.category,
      status: publication.status
    });
  };

  const handleUpdatePublication = () => {
    if (!editingPublication || !newPublication.title || !newPublication.description) return;

    setPublications(prev => prev.map(pub => 
      pub.id === editingPublication.id 
        ? { ...pub, ...newPublication }
        : pub
    ));
    setEditingPublication(null);
    setNewPublication({ title: '', description: '', category: '', status: 'draft' });
  };

  const handleDeletePublication = (id: string) => {
    setPublications(prev => prev.filter(pub => pub.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isAuthorized = user?.role === 'superadmin' || user?.role === 'publisher';

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="font-heading text-2xl font-bold">
              VTU Consortium
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
              <Link to="/resources" className="hover:text-orange-200 transition-colors">E-Resources</Link>
              <Link to="/journals" className="hover:text-orange-200 transition-colors">ONOS</Link>
              <Link to="/news" className="hover:text-orange-200 transition-colors">Downloads</Link>
              <Link to="/guide" className="hover:text-orange-200 transition-colors">User Guide</Link>
              <span className="text-orange-200 font-semibold">Publisher's Corner</span>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-5xl font-bold text-primary">
              Publisher's Corner - Publisher
            </h1>
            <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
              Manage and publish academic resources, research papers, and educational materials
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-l-4 border-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Publications</CardTitle>
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{publications.length}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
                  <FileText className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {publications.filter(p => p.status === 'published').length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-yellow-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
                  <Edit className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {publications.filter(p => p.status === 'draft').length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Downloads</CardTitle>
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {publications.reduce((sum, p) => sum + p.downloads, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Publications Management */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Publications Management
              </h2>
              {isAuthorized && (
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Publication
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Publication</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newPublication.title}
                          onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Publication title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newPublication.description}
                          onChange={(e) => setNewPublication(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Publication description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newPublication.category}
                          onChange={(e) => setNewPublication(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Mathematics, Electronics"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleAddPublication} className="flex-1">
                          Add Publication
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Publications List */}
            <div className="space-y-6">
              {publications.map((publication) => (
                <Card key={publication.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="font-heading text-xl text-gray-800">
                            {publication.title}
                          </CardTitle>
                          <Badge className={getStatusColor(publication.status)}>
                            {publication.status}
                          </Badge>
                        </div>
                        <p className="font-paragraph text-gray-600 mb-3">
                          {publication.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {publication.publishDate.toLocaleDateString()}
                          </span>
                          <span>By {publication.author}</span>
                          <span>Category: {publication.category}</span>
                          <span>{publication.downloads} downloads</span>
                        </div>
                      </div>
                      {isAuthorized && (
                        <div className="flex space-x-2 ml-4">
                          <Dialog open={editingPublication?.id === publication.id} onOpenChange={(open) => {
                            if (!open) {
                              setEditingPublication(null);
                              setNewPublication({ title: '', description: '', category: '', status: 'draft' });
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPublication(publication)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Publication</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-title">Title</Label>
                                  <Input
                                    id="edit-title"
                                    value={newPublication.title}
                                    onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={newPublication.description}
                                    onChange={(e) => setNewPublication(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-category">Category</Label>
                                  <Input
                                    id="edit-category"
                                    value={newPublication.category}
                                    onChange={(e) => setNewPublication(prev => ({ ...prev, category: e.target.value }))}
                                  />
                                </div>
                                <div className="flex space-x-2">
                                  <Button onClick={handleUpdatePublication} className="flex-1">
                                    Update
                                  </Button>
                                  <Button variant="outline" onClick={() => setEditingPublication(null)} className="flex-1">
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePublication(publication.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {publication.status === 'published' && (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ Published
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center">
            <p className="font-paragraph text-gray-400">
              © 2025 VTU Consortium Portal. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}