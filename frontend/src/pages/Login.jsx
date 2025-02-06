import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Container,
  Typography,
  Box,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid2,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { makeStyles } from '@mui/styles';
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { login } from "../store/actions/auth";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "../axiosConfig";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 251, 251, 0.04)',
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backdropFilter: 'blur(4px)',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  background: {
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.authState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const responseGoogle = async (authResult) => {
    try {
      console.log("authResult", authResult);
      if (authResult["code"]) {
        const result = await axios.get(`/auth/google?code=${authResult.code}`);
        const { email, firstName, lastName, avatar } = result.data.user;
        const token = result.data.token;
        const obj = { email, firstName, lastName, avatar, token };
        console.log("object",obj)
        localStorage.setItem("user", JSON.stringify(obj));
        navigate("/");
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log("Error while Google Login...", e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password))
      .catch(err => {
        setError("Login failed. Please check your credentials.");
      });
  };

  return (
    <div className={classes.background}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '30px', marginBottom: '10px', padding: "10px" }}
            >
              Sign In
            </Button>

            <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 1 }}>
              Other sign in options
            </Typography>
            <Grid2 container spacing={2} style={{ marginTop: '16px', justifyContent: 'center' }}>
              <Grid2  xs={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    borderColor: "#fff",
                    padding: "10px",
                    "&:hover": {
                      borderColor: "#fff",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  onClick={googleLogin}
                >
                  <GoogleIcon style={{ fontSize: "24px" }} />
                  <Typography style={{ padding: "5px", fontWeight: 700 }}>Continue with Google</Typography>
                </Button>
              </Grid2>
            </Grid2>

            <Grid2 sx={{ marginTop: 3 }}>
              <Grid2 container justifyContent="center">
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?&nbsp;
                </Typography>
                <Link to='/register' variant="body2" style={{ textDecoration: 'none', color: 'skyblue', fontSize: '14px' }}>
                  Sign Up
                </Link>
              </Grid2>
              <Grid2 container justifyContent="center">
                <Link to="/forgot-password" variant="body2" style={{ textDecoration: 'none', color: 'skyblue', fontSize: '14px' }}>
                  Forgot password?
                </Link>
              </Grid2>
            </Grid2>
          </form>
        </div>
        <Box mt={8}></Box>
      </Container>
    </div>
  );
};

export default Login;