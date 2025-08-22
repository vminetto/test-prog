import { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";

type Props = {
  email?: string;
  avatarUrl?: string; 
};

export default function UserMenu({ email, avatarUrl }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const initial = email?.[0]?.toUpperCase() || "U";

  return (
    <>
      <Tooltip title={email || "Usuário"}>
        <IconButton
          onClick={handleOpen}
          color="inherit"
          aria-label="menu do usuário"
          size="small"
          sx={{ ml: 1 }}
        >
          <Avatar
            src={avatarUrl || undefined}
            alt={email}
            sx={{ width: 32, height: 32 }}
          >
            {!avatarUrl && initial}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/perfil");
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Perfil</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            handleClose();
            logout();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
