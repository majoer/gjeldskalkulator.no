import Clear from "@mui/icons-material/Clear";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ReactElement, useEffect, useRef, useState } from "react";

export interface AppExpandingPaperComponentProps {
  title: string;
  children: ReactElement;
  open: boolean;
  onChange?: ({}: { open: boolean }) => void;
}

export default function AppExpandingPaperComponent({
  children,
  title,
  open,
  onChange,
}: AppExpandingPaperComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const paperRef = useRef(null);
  const openInternal = open === undefined ? isOpen : open;

  useEffect(() => {
    if (openInternal) {
      setTimeout(() => paperRef.current?.scrollIntoView(), 400);
    }
  }, [openInternal]);

  return (
    <Paper
      ref={paperRef}
      elevation={5}
      className={`relative m-2 p-3 transition-all duration-700 ${
        openInternal ? "w-full h-96 " : "w-full sm:w-2/5 md:w-3/12 h-14"
      }`}
    >
      {openInternal ? (
        <IconButton
          className="absolute top-0 right-0"
          onClick={() => {
            setIsOpen(false);
            onChange ? onChange({ open: false }) : null;
          }}
        >
          <Clear />
        </IconButton>
      ) : null}
      <div className="text-center">
        {openInternal ? (
          <Typography align="center" variant="h6">
            {title.toUpperCase()}
          </Typography>
        ) : (
          <Button
            color="inherit"
            className="w-full px-0"
            onClick={() => {
              setIsOpen(true);
              onChange ? onChange({ open: true }) : null;
            }}
          >
            {title}
          </Button>
        )}
      </div>
      <div
        className={`p-4 transition-opacity duration-700 delay-300 ${
          openInternal ? "opacity-100" : "opacity-0"
        }`}
      >
        {openInternal ? children : null}
      </div>
    </Paper>
  );
}
