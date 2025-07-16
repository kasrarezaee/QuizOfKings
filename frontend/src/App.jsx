import Login from "./pages/Login"
import { QueryClient , QueryClientProvider } from "react-query"
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import Menu from "./pages/Menu"
import SignUp from "./pages/Signup"
import Sessions from "./pages/Sessions"
import QuestionDesign from "./pages/QustionDesign"
import QuestionAnswer from "./pages/QuestionAnswer"
import Profile from "./pages/Profile"
import ChatPage from "./pages/ChatPage"
import CategorySelect from "./pages/CategorySelect"
import Layout from "./layout/layout"
function App() {
  const client = new QueryClient()
  return(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/menu" element={<Menu/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/sessions" element={<Sessions/>}/>
              <Route path="/questionDesign" element={<QuestionDesign/>}/>
              <Route path="/questionAnswer" element={<QuestionAnswer/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/chat" element={<ChatPage/>}/>
              <Route path="/categorySelect" element={<CategorySelect/>}/>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
