import { CardProps } from "@mui/material";
import Card from "@mui/material/Card";
import Link from "next/link.js";

export interface AppClickableCardComponentProps {
  href: string;
}

export default function AppClickableCardComponent(
  props: CardProps & AppClickableCardComponentProps
) {
  return (
    <Card
      elevation={5}
      component={Link}
      href={props.href}
      className="pb-6 hover:bg-blue-50"
      {...props}
    >
      {props.children}
    </Card>
  );
}
