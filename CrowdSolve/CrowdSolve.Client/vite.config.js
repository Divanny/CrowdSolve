import { fileURLToPath, URL } from "node:url";
import process from "process";

import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import child_process from "child_process";

import fg from 'fast-glob'
import { minimatch } from 'minimatch'
import AutoImport from 'unplugin-auto-import/vite'

import Unfonts from "unplugin-fonts/vite";

function getHttpsConfig() {
  // Solo ejecutar esta lógica si no estamos en modo producción
  if (process.env.NODE_ENV === 'production') {
    return {};
  }

  const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ""
      ? `${process.env.APPDATA}/ASP.NET/https`
      : `${process.env.HOME}/.aspnet/https`;

  const certificateArg = process.argv
    .map((arg) => arg.match(/--name=(?<value>.+)/i))
    .filter(Boolean)[0];
  const certificateName = certificateArg
    ? certificateArg.groups.value
    : "CrowdSolve.Client";

  if (!certificateName) {
    console.error(
      "Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly."
    );
    process.exit(-1);
  }

  const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
  const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

  if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (
      0 !==
      child_process.spawnSync(
        "dotnet",
        [
          "dev-certs",
          "https",
          "--export-path",
          certFilePath,
          "--format",
          "Pem",
          "--no-password",
        ],
        { stdio: "inherit" }
      ).status
    ) {
      throw new Error("Could not create certificate.");
    }
  }

  return {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath),
  };
}

// auto import components
function pascalCaseWithCapitals(str) {
    return str
        .split("/")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

function removeExtension(str) {
    return path.basename(str, path.extname(str));
}

function getComponentImports() {
    const directories = [
        {
            pattern: "./src/components/**/*.{tsx,jsx}",
            omit: "./src/components",
        },
        {
            pattern: "./src/layouts/*.{tsx,jsx}",
            omit: "./src/",
        },
    ];

    const entries = fg.sync(
        directories.map((x) => x.pattern),
        {
            dot: true,
            objectMode: true,
        }
    );

    return entries.map((entry) => {
        const dirOptions = directories.find((dir) =>
            minimatch(entry.path, dir.pattern)
        );

        const componentName = entry.path
            .replace(new RegExp(dirOptions.omit, "gi"), "")
            .split("/")
            .filter(Boolean)
            .map(pascalCaseWithCapitals)
            .join("");

        const fromPath = entry.path.replace(/\.\/src/gi, "@");

        return {
            [fromPath]: [
                [removeExtension(entry.name), removeExtension(componentName)],
            ],
        };
    });
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  
  return {
    plugins: [
      plugin(),
      Unfonts({
        google: {
          families: ["Poppins:wght@400;500;600;700"],
        },
      }),
      AutoImport({
        dts: './auto-imports.d.ts',
        defaultExportByFilename: false,
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        },
        include: [
          /\.[tj]sx?$/ // .ts, .tsx, .js, .jsx
        ],
        dirs: [
          './src/hooks'
        ],
        imports: [
          ...getComponentImports(),
          'react',
          'react-router'
        ]
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "^/api": {
          target: "https://localhost:7137/",
          secure: false,
        },
      },
      port: 5173,
      https: !isProduction ? getHttpsConfig() : undefined,
    },
  };
});