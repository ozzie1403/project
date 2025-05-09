import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ExternalLink, ThumbsUp, Share2 } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  imageUrl: string;
  url: string;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('http://localhost:3001/api/resources');
        // const data = await response.json();
        
        // Mock data for now
        const mockResources: Resource[] = [
          {
            id: '1',
            title: 'Budgeting 101: How to Create Your First Budget',
            description: 'Learn the fundamentals of creating a personal budget that works for your lifestyle and financial goals.',
            category: 'budgeting',
            readTime: 5,
            imageUrl: 'https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            url: '#'
          },
          {
            id: '2',
            title: 'Emergency Fund: Why You Need One and How to Build It',
            description: 'Discover the importance of having an emergency fund and practical steps to start building your financial safety net.',
            category: 'saving',
            readTime: 7,
            imageUrl: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            url: '#'
          },
          {
            id: '3',
            title: 'Debt Repayment Strategies That Actually Work',
            description: 'Explore proven methods for paying down debt efficiently and taking control of your financial future.',
            category: 'debt',
            readTime: 8,
            imageUrl: 'https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            url: '#'
          },
          {
            id: '4',
            title: 'Investing for Beginners: Getting Started with Small Amounts',
            description: 'Learn how to start investing with limited funds and build wealth over time through smart investment strategies.',
            category: 'investing',
            readTime: 10,
            imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            url: '#'
          },
          {
            id: '5',
            title: '5 Ways to Cut Your Monthly Expenses',
            description: 'Practical tips for reducing your monthly spending without sacrificing your quality of life.',
            category: 'budgeting',
            readTime: 4,
            imageUrl: 'https://images.pexels.com/photos/3943715/pexels-photo-3943715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            url: '#'
          },
          {
            id: '6',
            title: 'Understanding Credit Scores and How to Improve Yours',
            description: 'Everything you need to know about credit scores, credit reports, and practical steps to boost your creditworthiness.',
            category: 'credit',
            readTime: 9,
            imageUrl: 'https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            url: '#'
          }
        ];
        
        setResources(mockResources);
        setFilteredResources(mockResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources based on search and category
  useEffect(() => {
    let results = resources;
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(resource => 
        resource.title.toLowerCase().includes(lowercasedSearch) || 
        resource.description.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(resource => resource.category === selectedCategory);
    }
    
    setFilteredResources(results);
  }, [searchTerm, selectedCategory, resources]);

  // All available categories
  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'budgeting', label: 'Budgeting' },
    { value: 'saving', label: 'Saving' },
    { value: 'debt', label: 'Debt Management' },
    { value: 'investing', label: 'Investing' },
    { value: 'credit', label: 'Credit' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800">Financial Resources</h1>
        <p className="text-gray-500 mt-1">Learn about personal finance and improve your money management skills</p>
      </header>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-primary-500 focus:ring-opacity-50 focus:border-primary-500"
              placeholder="Search resources..."
            />
          </div>
          
          {/* Category Filter */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-primary-500 focus:ring-opacity-50 focus:border-primary-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resource Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={resource.imageUrl} 
                  alt={resource.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full capitalize">
                    {resource.category}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center">
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    {resource.readTime} min read
                  </span>
                </div>
                <h3 className="font-display font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={resource.url}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium text-sm"
                  >
                    Read Article
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-primary-600 transition-colors">
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-primary-600 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;