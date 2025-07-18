import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { useQuery, useMutation } from "react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../services/apiClient";
import { API_CONFIG, ROUTES } from "../config/settings";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const Profile = () => {
  const { user_id } = useParams();
  const { accessToken, userInfo } = useAuth();
  const [role, setRole] = useState("");
  const [clicked, setClicked] = useState(false);

  const isAdmin = userInfo?.role_name === "admin";

  
  const block_mutation = useMutation(
    async () => {
      const response = await apiCall(
        API_CONFIG.BASE_URL + ROUTES.BLOCK + user_id,
        "POST",
        accessToken,
        null
      );
      return await response.json();
    },
    {
      onSuccess: () => {
        setClicked(true);
        alert("User blocked");
      },
    }
  );

  
  const unblock_mutation = useMutation(
    async () => {
      const response = await apiCall(
        API_CONFIG.BASE_URL + ROUTES.BLOCK + user_id,
        "DELETE",
        accessToken,
        null
      );
      return await response.json();
    },
    {
      onSuccess: () => {
        setClicked(false);
        alert("User unblocked");
      },
    }
  );

  const handleClick = () => {
    if (!clicked) {
      block_mutation.mutate();
    } else {
      unblock_mutation.mutate();
    }
  };

  
  const role_mutation = useMutation(async (role_id) => {
    const response = await apiCall(
      API_CONFIG.BASE_URL + ROUTES.USERS+"role/" + user_id + "/" + role_id,
      "POST",
      accessToken,
      null
    );
    return await response.json();
  },
  {
    onSuccess:()=>alert("done"),
    onError:(error)=>alert(error)
  }
    
);

  const handleChange = (event) => {
    setRole(event.target.value);
    role_mutation.mutate(event.target.value);
  };

  
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery(
    ["profile", user_id],
    async () => {
      const response = await apiCall(
        API_CONFIG.BASE_URL + ROUTES.PLAYER_STATS + user_id,
        "GET",
        accessToken,
        null
      );
      return await response.json();
    },
    {
      onSuccess: (data) => {
        if (data?.[0]?.is_blocked !== undefined) {
          setClicked(data[0].is_blocked);
        }
      },
    }
  );

  
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
    error: rolesError,
  } = useQuery(
    ["roles", user_id],
    async () => {
      const response = await apiCall(
        API_CONFIG.BASE_URL + ROUTES.ROLES,
        "GET",
        accessToken,
        null
      );
      return await response.json();
    },
    {
      enabled: isAdmin, // 👈 only run this if admin
    }
  );

  
  if (isProfileLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Spinner />
      </Box>
    );
  }

  if (isProfileError) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Error loading profile: {profileError.message}
        </Typography>
      </Box>
    );
  }

  const user = profileData?.[0];

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"100vh"}
      bgcolor={"rgba(54, 140, 238, 0.36)"}
      flexDirection={"column"}
    >
      <Paper
        elevation={24}
        sx={{
          padding: 4,
          width: 320,
          borderRadius: 4,
          background: "linear-gradient(135deg, #304ceeff 30%, #47a2ecff 90%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
          {user?.username}
        </Typography>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.3)" }} />

        <Typography variant="body1" fontSize="1.1rem">
          🎮 <strong>Total Games:</strong> {user?.total_games}
        </Typography>

        <Typography variant="body1" fontSize="1.1rem">
          🏆 <strong>Games Won:</strong> {user?.games_won}
        </Typography>

        <Typography variant="body1" fontSize="1.1rem">
          🎯 <strong>Accuracy:</strong> {user?.average_accuracy}
        </Typography>

        <Typography variant="body1" fontSize="1.1rem">
          ⭐ <strong>XP Level:</strong> {user?.xp_level}
        </Typography>
      </Paper>

      {isAdmin && (
        <>
          <FormControl sx={{ width: "200px", mt: "20px" }}>
            <InputLabel id="select-role-label">Role</InputLabel>
            <Select
              labelId="select-role-label"
              id="select-role"
              value={role}
              label="Role"
              onChange={handleChange}
            >
              {isRolesLoading ? (
                <MenuItem disabled>Loading roles...</MenuItem>
              ) : isRolesError ? (
                <MenuItem disabled>Error loading roles</MenuItem>
              ) : (
                rolesData?.map((role) => (
                  <MenuItem key={role?.role_id} value={role?.role_id}>
                    {role?.role_name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Button
            type="button"
            variant={clicked ? "outlined" : "contained"}
            color="primary"
            sx={{ mt: "10px", borderRadius: "10px" }}
            onClick={handleClick}
            disabled={block_mutation.isLoading || unblock_mutation.isLoading}
          >
            {clicked ? "Unblock" : "Block"}
          </Button>
        </>
      )}
    </Box>
  );
};

export default Profile;
