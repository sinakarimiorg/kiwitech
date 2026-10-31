import { defineConfig } from "vitest/config"
import path from "path"

const root = __dirname

export default defineConfig({
    resolve: {
        alias: {
            "@root": root,
            "@models": path.join(root, "src/models"),
            "@lib": path.join(root, "src/lib"),
            "@": path.join(root, "src"),
        },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
})
