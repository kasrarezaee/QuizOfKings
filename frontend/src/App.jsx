import Navbar from "./components/navbar"
import Sessions from "./pages/Sessions"
import CategorySelect from "./pages/CategorySelect"
import Login from "./pages/Login"
import Menu from "./pages/Menu"
import QuestionAnswer from "./pages/QuestionAnswer"
import SignUp from "./pages/Signup"
import Profile from "./pages/Profile"
import User from "./components/User"
import Session from "./components/Session"
import QuestionDesign from "./pages/QustionDesign"
import ChatPage from "./pages/ChatPage"
import { QueryClient , QueryClientProvider } from "react-query"
function App() {
  const query = new QueryClient()
  return (
    <QueryClientProvider client={query}>
      <Login/>
    </QueryClientProvider>
  )
}

export default App
