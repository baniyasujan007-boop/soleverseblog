import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { HomepageProvider } from "./context/HomepageContext";

function App() {
  return (
    <AuthProvider>
      <HomepageProvider>
        <AppRouter />
      </HomepageProvider>
    </AuthProvider>
  );
}

export default App;
