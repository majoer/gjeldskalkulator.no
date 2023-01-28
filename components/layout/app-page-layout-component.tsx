import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head.js";
import { ReactNode } from "react";

export interface AppPageLayoutProps {
  title: string;
  description: string;
  children: ReactNode | ReactNode[];
  showH1?: boolean;
}

export default function AppPageLayoutComponent({
  title,
  description,
  children,
  showH1 = true,
}: AppPageLayoutProps) {
  return (
    <div className="m-auto text-center">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
      </Head>

      {showH1 ? (
        <Typography variant="h1" className="py-10">
          {title}
        </Typography>
      ) : null}
      {children}
    </div>
  );
}
