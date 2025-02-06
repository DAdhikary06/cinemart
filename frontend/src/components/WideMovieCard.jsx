import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const WideMovieCard = ({ movie }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens
  const isTabletOrDesktop = useMediaQuery(theme.breakpoints.up("md")); // Detect tablets and up
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // Detect desktop screens

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      {/* Hero card background image */}
      <CardMedia
        component="img"
        image={movie.cover} // Use your movie's image here
        alt={movie.title}
        sx={{
          objectFit: "cover",
          height: { xs: 320, sm: 360, md: 400 },
        }}
      />

      {/* Black-to-transparent gradient for text background */}
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background:
            "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 50%);",
          padding: "28px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          {movie.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#fff", marginTop: "8px" }}>
          {movie.genre.map((genre, idx) => (
            <Chip key={idx} label={genre} size="small" sx={{ margin: "8px" }} />
          ))}
        </Typography>
      </Box>
    </Card>
  );
};

export default WideMovieCard;
