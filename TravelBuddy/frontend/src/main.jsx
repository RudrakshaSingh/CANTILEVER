import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./Redux/store.js";
import GoogleMapsProvider from "./components/GoogleMapsProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <Toaster />
        <GoogleMapsProvider>
          <App />
        </GoogleMapsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
