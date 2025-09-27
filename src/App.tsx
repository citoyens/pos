import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Router from "app/router";
import store from "app/store";
import theme from "app/theme";
import { Provider } from "react-redux";
import { useMount, useUnmount } from "react-use";

function App() {
  const doNotPressEnter = (event: any) => {
    const codeValue = event.code;
    if (codeValue === "Enter") {
      event.preventDefault();
    }
  };

  let initializeKeyDownEvent = false;

  useMount(() => {
    if (!initializeKeyDownEvent) {
      initializeKeyDownEvent = true;
      document.addEventListener("keydown", doNotPressEnter, true);
    }
  });

  useUnmount(() => {
    if (initializeKeyDownEvent) {
      initializeKeyDownEvent = false;
      document.removeEventListener("keydown", doNotPressEnter, true);
    }
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
