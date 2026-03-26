import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        base: mode === "production" ? "/Work-Module/" : "/",
        plugins: [react()],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        "vendor-antd": ["antd", "@ant-design/icons"],
                    },
                },
            },
        },
    });
});
