import { CalorieCard } from './components/CalorieCard.tsx'
import { FoodLogCard } from './components/FoodLogCard.tsx'
import { BottomNavigation } from './components/BottomNavigation.tsx'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router'
import Scanner from './pages/Scanner.tsx';
import Profile from './pages/Profile.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddFood from './pages/AddFood.tsx';
import { HomePage } from './pages/HomePage.tsx';
import AddMeal from './pages/AddMeal.tsx';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes >
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="analyze" element={<Scanner />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-food" element={<AddFood />} />
            <Route path="add-meal" element={<AddMeal />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>

  )
}

export default App

const Layout = () => {
  return (
    <div className="flex flex-col m-1 h-screen">
      <div className="flex-1 flex flex-col">
        <Outlet />
        <BottomNavigation />

      </div>

    </div>
  )

}
