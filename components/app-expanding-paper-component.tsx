import Clear from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ReactElement, useEffect, useRef, useState } from "react";

export interface AppExpandingPaperComponentProps {
  title: string;
  children: ReactElement;
  onChange?: ({}: { open: boolean }) => void;
}

export default function AppExpandingPaperComponent({
  children,
  title,
  onChange,
}: AppExpandingPaperComponentProps) {
  const [open, setOpen] = useState(false);
  const paperRef = useRef(null);

  useEffect(() => {
    if (onChange) {
      onChange({ open });
    }
  }, [open]);

  return (
    <Paper
      ref={paperRef}
      elevation={5}
      className={`relative m-2 p-3 transition-all duration-700 ${
        open ? "w-full h-96 " : "w-full sm:w-2/5 md:w-3/12 h-14"
      }`}
    >
      {open ? (
        <IconButton
          className="absolute top-0 right-0"
          onClick={() => setOpen(false)}
        >
          <Clear />
        </IconButton>
      ) : null}

      <Typography
        align="center"
        variant="h6"
        onClick={() => {
          setOpen(true);
          setTimeout(() => paperRef.current.scrollIntoView(), 400);
        }}
      >
        {title}
      </Typography>

      <div
        className={`p-4 transition-opacity duration-700 delay-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        {open ? children : null}
      </div>
    </Paper>
  );
}
