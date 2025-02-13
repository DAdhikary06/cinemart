import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../store/actions/bookings";
import { format } from 'date-fns';
import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid2,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "react-qr-code";
import PaginationComponent from "../components/Pagination/PaginationComponent";

const Bookings = () => {

  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookingState);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookingsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("Fetching bookings...");
    dispatch(fetchBookings());
    console.log("Bookings fetched!");
  }, [dispatch]);

  console.log("Bookings now: ", bookings);


  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getCurrentBookings = () => {
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    return bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, width: "100%" }}>
        Bookings
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
          {/* {bookings && bookings?.map((booking) => ( */}
          {getCurrentBookings().map((booking) => (
            <Grid2 container key={booking._id} sx={{ width: "100%" }}>
              <Card sx={{
                display: isMobile ? "block" : "flex",
                width: "100%",
                p: 2,
                borderRadius: 2,
                boxShadow: 3,
                alignItems: "center"
              }}>

                {/* Movie Poster */}
                <CardMedia
                  component="img"
                  sx={{ width: 140, borderRadius: 2 }}
                  image={booking.movie.image}
                  alt={booking.movie.title}
                />

                {/* Booking Details */}
                <CardContent sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {booking.movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Language: {booking.movie.language}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Screen Type: {booking.showtime.screenId.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {format(new Date(booking.showtime.date), "dd MMM yyyy")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Time: {format(new Date(booking.showtime.startAt), "hh:mm a")} - {format(new Date(booking.showtime.endAt), "hh:mm a")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booked Seats: {booking.bookedSeats
                      .flatMap(rowData => rowData.seats.map(seat => `${rowData.row}${seat}`))
                      .join(", ")}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                    Amount Paid: ₹{booking.totalPrice}
                  </Typography>
                </CardContent>

                <Box sx={{ display: isMobile ? "block" : "flex", flexDirection: "column", gap: 12 }}>
                  {/* Status Badge */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Chip label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      color={booking.status === "booked" ? "success" :
                        booking.status === "checked" ? "primary" :
                          "error"
                      }
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>

                  {/* Show Ticket Button (Only when status = "booked") */}
                  {booking.status === "booked" && (
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog(booking)}>
                      Show Ticket
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid2>
          ))}
        </Box>
      )}

      <PaginationComponent
        totalItems={bookings.length}
        itemsPerPage={bookingsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Dialog Box for QR Ticket */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Your Ticket
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1, p: 3 }}>
          {selectedBooking && (
            <>
              <Typography variant="h6" fontWeight="bold">
                {selectedBooking.movie.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {format(new Date(selectedBooking.showtime.date), "dd MMM yyyy")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {format(new Date(selectedBooking.showtime.startAt), "hh:mm a")} - {format(new Date(selectedBooking.showtime.endAt), "hh:mm a")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Seats: {selectedBooking.bookedSeats?.flatMap(rowData => rowData.seats.map(seat => `${rowData.row}${seat}`))
                  .join(", ")}
              </Typography>

              {/* QR Code */}
              <QRCode value={selectedBooking._id} size={180} />

              <Typography variant="body2" sx={{ color: "gray", mt: 2 }}>
                Scan this QR code at the entrance.
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Bookings;