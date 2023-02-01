import Typography from "@mui/material/Typography";
import Head from "next/head.js";
import { ReactNode } from "react";

export interface AppPageLayoutProps {
  title: string;
  description: string;
  children: ReactNode | ReactNode[];
  showH1?: boolean;
  align?: "text-left" | "text-center";
}

export default function AppPageLayoutComponent({
  title,
  description,
  children,
  showH1 = true,
  align = "text-center",
}: AppPageLayoutProps) {
  return (
    <div className={`m-auto ${align}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
      </Head>

      <Typography variant="h1" className={`py-10 ${showH1 ? "block" : "hidden"}`}>
        {title}
      </Typography>
      {children}
    </div>
  );
}
