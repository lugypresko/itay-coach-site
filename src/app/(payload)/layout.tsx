import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import type { ReactNode } from "react";

import config from "@payload-config";

import { importMap } from "./admin/importMap.js";
import "@payloadcms/next/css";
import "./admin/custom.css";

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

type PayloadLayoutProps = {
  children: ReactNode;
};

export default function PayloadLayout({ children }: PayloadLayoutProps) {
  return (
    <RootLayout
      config={config}
      htmlProps={{ suppressHydrationWarning: true }}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
