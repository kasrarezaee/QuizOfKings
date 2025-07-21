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
import Users from "./pages/Users"
import Questions from "./pages/Questions"
import Rounds from "./pages/Rounds"
import RoundQuestions from "./pages/RoundQuestions"


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
              <Route path="/chat/:sessionId/:senderId/:receiverId" element={<ChatPage/>}/>
              <Route path="/questionAnswer/:question_id/:title" element={<QuestionAnswer/>}/>
              <Route path="/profile/:user_id" element={<Profile/>}/>
              <Route path="/categorySelect/:session_id" element={<CategorySelect/>}/>
              <Route path="/leaderboard" element={<Users title="leader board"/>}/>
              <Route path="/users" element={<Users title="users"/>}/>
              <Route path="/questions" element={<Questions title={'manage'}/>}/>
              <Route path="/rounds/:session_id" element={<Rounds/>}/>
              <Route path="/round_questions/:round_id/:title" element={<RoundQuestions/>}/>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
