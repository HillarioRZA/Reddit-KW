// App.jsx
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <header>
        <h1>HaiDok</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2024 Healthcare Inc. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
