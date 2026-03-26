import { useLocation } from 'react-router-dom'

const RouteTest = () => {
  const location = useLocation()
  
  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3 z-50">
      <p className="text-sm font-medium">Current Route: {location.pathname}</p>
    </div>
  )
}

export default RouteTest
