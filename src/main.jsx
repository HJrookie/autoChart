import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd'

createRoot(document.getElementById("root")).render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>
);
