'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next';

// Mock data for challenges s
const challengesData = [
  { id: 1, name: 'Desafío de Programación', category: 'Software', image: 'https://jessup.edu/wp-content/uploads/2023/12/Programming-in-Computer-Science.jpg', company: 'Tech Corp', endDate: '2024-12-31' },
  { id: 2, name: 'Reto de Diseño UI', category: 'Diseño', image: 'https://www.elegantthemes.com/blog/wp-content/uploads/2018/10/000-Web-UI-Design.png', company: 'Design Studio', endDate: '2024-11-15' },
  { id: 3, name: 'Desafío de Base de Datos', category: 'Datos', image: 'https://media.licdn.com/dms/image/D4D12AQEQgBaMF_Q1kA/article-cover_image-shrink_600_2000/0/1685983138455?e=2147483647&v=beta&t=NPavE5eVdVnVbwlggdNdk6DUDILSOVV-GVlqF2Lmpac', company: 'Data Experts', endDate: '2024-12-05' },
  { id: 4, name: 'Reto de Seguridad', category: 'CiberSeguridad', image: 'https://www.starkcloud.com/hubfs/Imported_Blog_Media/Que-es-Ciberseguridad.webp', company: 'CyberSafe', endDate: '2025-01-10' },
  { id: 5, name: 'Desafío de Optimización', category: 'Software', image: 'https://jessup.edu/wp-content/uploads/2023/12/Programming-in-Computer-Science.jpg', company: 'Optimize Solutions', endDate: '2024-11-30' },
  { id: 6, name: 'Reto de Frontend', category: 'Software', image: 'https://jessup.edu/wp-content/uploads/2023/12/Programming-in-Computer-Science.jpg', company: 'Web Wonders', endDate: '2024-12-20' },
  { id: 7, name: 'Desafío de Backend', category: 'Software', image: 'https://jessup.edu/wp-content/uploads/2023/12/Programming-in-Computer-Science.jpg', company: 'Backbone Tech', endDate: '2024-12-25' },
  { id: 8, name: 'Reto de Machine Learning', category: 'IA', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCnWhQaVLqlcDE4LYfmcTKsDPpWUG4xkTzuA&s', company: 'AI Labs', endDate: '2025-01-05' },
  { id: 9, name: 'Desafío de DevOps', category: 'Software', image: 'https://jessup.edu/wp-content/uploads/2023/12/Programming-in-Computer-Science.jpg', company: 'DevOps World', endDate: '2024-11-22' },
  { id: 10, name: 'Reto de Mobile', category: 'Software', image: 'https://jessup.edu/wp-content/uploads/2023/12/Programming-in-Computer-Science.jpg', company: 'Mobile Masters', endDate: '2024-12-15' },
  { id: 11, name: 'Desafío de Cloud Computing', category: 'IA', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCnWhQaVLqlcDE4LYfmcTKsDPpWUG4xkTzuA&s', company: 'Cloud Innovators', endDate: '2024-12-10' },
  { id: 12, name: 'Reto de Data Science', category: 'Datos', image: 'https://media.licdn.com/dms/image/D4D12AQEQgBaMF_Q1kA/article-cover_image-shrink_600_2000/0/1685983138455?e=2147483647&v=beta&t=NPavE5eVdVnVbwlggdNdk6DUDILSOVV-GVlqF2Lmpac', company: 'Data Insights', endDate: '2024-11-28' },
];

export default function Component() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('')
  const [currentFilter, setCurrentFilter] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const challengesPerPage = 9
  const filterScrollRef = useRef(null)
  
  const navigate = useNavigate();
  const filters = [t('ChallengeCatalog.filters.all'), t('ChallengeCatalog.filters.design'), t('ChallengeCatalog.filters.software'), t('ChallengeCatalog.filters.data'), t('ChallengeCatalog.filters.ai'),  t('ChallengeCatalog.filters.cybersecurity')]

  const filteredChallenges = challengesData.filter(challenge => 
    challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (currentFilter === 'Todos' || challenge.category === currentFilter)
  )

  const indexOfLastChallenge = currentPage * challengesPerPage
  const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    const handleResize = () => {
      if (filterScrollRef.current) {
        const scrollWidth = filterScrollRef.current.scrollWidth
        const clientWidth = filterScrollRef.current.clientWidth
        filterScrollRef.current.style.justifyContent = scrollWidth > clientWidth ? 'flex-start' : 'center'
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('ChallengeCatalog.pageTitle')}</h1>
      
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder={t('ChallengeCatalog.searchPlaceholder')}
          className="w-full p-2 pl-10 rounded-md border border-input bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>

      <div className="relative mb-8">
        <div
          ref={filterScrollRef}
          className="flex overflow-x-auto pb-2 space-x-4 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                currentFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground hover:bg-accent/80'
              }`}
              onClick={() => setCurrentFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <img src={challenge.image} alt={challenge.name} className="w-full h-48 object-cover rounded-lg" />
              </div>
              <div className="px-4 pb-4">
                <h3 className="font-semibold text-lg mb-2 mt-3">{challenge.name}</h3>
                <p className="text-muted-foreground text-sm"><strong>{t('ChallengeCatalog.categories.label')}:</strong> {challenge.category}</p>
                <p className="text-muted-foreground text-sm"><strong>{t('ChallengeCatalog.categories.company')}:</strong> {challenge.company}</p>
                <p className="text-muted-foreground text-sm"><strong>{t('ChallengeCatalog.categories.endDate')}:</strong> {challenge.endDate}</p>
                <div className="flex justify-end mt-4">
                  <Button onClick={()=>navigate(`/challengesDetails/`)} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  {t('ChallengeCatalog.buttons.viewMore')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-accent bg-opacity-50 rounded-lg">
          <img
            src="/placeholder.svg?height=100&width=100"
            alt={t('ChallengeCatalog.noResults.imageAlt')}
            className="w-24 h-24 mb-4 opacity-50"
          />
          <h2 className="text-3xl font-bold text-muted-foreground">{t('ChallengeCatalog.noResults.title')}</h2>
        </div>
      )}

      {filteredChallenges.length > 0 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/80 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-muted-foreground">
          {t('ChallengeCatalog.pagination.page')} {currentPage} {t('ChallengeCatalog.pagination.of')} {Math.ceil(filteredChallenges.length / challengesPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastChallenge >= filteredChallenges.length}
            className="p-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/80 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}