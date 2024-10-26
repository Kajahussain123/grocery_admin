import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Category, AddBox, ViewList, People, Payment, Notifications, Dashboard, ShoppingCart } from '@mui/icons-material';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ImageIcon from '@mui/icons-material/Image';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';


function Sidebar({ onMenuClick }) {
  const [open, setOpen] = useState({
    category: false,
    product: false,
    addCarousal: false, // New state for Add Carousal dropdown
    subAdmin: false,
  });

  const [permissions, setPermissions] = useState(null);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(''); // Track selected menu

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('groceryadmin'));
    if (storedUser) {
      setPermissions(storedUser.permissions);
      setIsSuperUser(storedUser.is_superuser);
    }
  }, []);

  const toggleSection = (section) => {
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMenuClick = (action) => {
    setSelectedMenu(action); // Set the selected menu item
    if (onMenuClick) onMenuClick(action); // Call the provided click handler
  };

  const drawerStyles = {
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: 240,
      backgroundColor: '#043e6b',
      color: 'white',
    },
    '& .MuiListItem-root:hover': {
      backgroundColor: '#065d94',
    },
    '& .MuiListItemIcon-root': {
      minWidth: '40px',
    },
    '& .MuiTypography-root': {
      fontWeight: 'bold',
      fontSize: '16px',
    },
  };

  const selectedItemStyles = {
    backgroundColor: '#065d94', // Highlight selected item
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, action: 'dashboard', permission: true },
    { text: 'Analytical Report', icon: <AssessmentIcon />, action: 'reports', permission: true },
    {
      text: 'Category',
      icon: <Category />,
      action: null,
      permission: isSuperUser || (permissions && permissions.products),
      children: [
        { text: 'View Category', icon: <ViewList />, action: 'viewCategory' },
        { text: 'Add Category', icon: <AddBox />, action: 'addCategory' },
        { text: 'View Subcategory', icon: <ViewList />, action: 'viewSubcategory' },
        { text: 'Add Subcategory', icon: <AddBox />, action: 'addSubcategory' },
      ],
    },
    {
      text: 'Product',
      icon: <Category />,
      action: null,
      permission: isSuperUser || (permissions && permissions.products),
      children: [
        { text: 'Add Product', icon: <AddBox />, action: 'addProduct' },
        { text: 'View Product', icon: <ViewList />, action: 'viewProduct' },
        { text: 'View Stocks', icon: <ProductionQuantityLimitsIcon />, action: 'viewStocks' },
      ],
    },
    {
      text: 'Orders',
      icon: <ShoppingCart />,
      action: 'viewOrders',
      permission: isSuperUser || (permissions && permissions.orders),
    },
    {
      text: 'Delivery Boy',
      icon: <DeliveryDiningIcon />,
      action: 'viewDelivery',
      permission: isSuperUser || (permissions && permissions.orders),
    },
    {
      text: 'Customers',
      icon: <People />,
      action: 'viewCustomers',
      permission: isSuperUser || (permissions && permissions.users),
    },
    {
      text: 'Payments',
      icon: <Payment />,
      action: 'viewPayments',
      permission: isSuperUser,
    },
    {
      text: 'Add Carousal',
      icon: <ImageIcon />,
      action: null,
      permission: isSuperUser,
      children: [
        { text: 'Add Carousal', icon: <AddBox />, action: 'addCarosal' },
        { text: 'Add Poster', icon: <AddBox />, action: 'addPoster' },
        { text: 'Add Home Image', icon: <AddBox />, action: 'addHomeImage' },
      ],
    },
    {
      text: 'Notification',
      icon: <Notifications />,
      action: 'notifications',
      permission: isSuperUser,
    },
    {
      text: 'Send Notifications',
      icon: <Notifications />,
      action: 'sendnotifications',
      permission: isSuperUser,
    },
     // {
    //   text: 'Sub Admin',
    //   icon: <People />,
    //   action: null,
    //   permission: isSuperUser,
    //   children: [
    //     { text: 'Add Sub Admin', icon: <AddBox />, action: 'addSubAdmin' },
    //     { text: 'View Sub Admin', icon: <ViewList />, action: 'viewSubAdmin' },
    //   ],
    // },
  ];

  return (
    <>
      <Hidden smUp implementation="css">
        <Drawer variant="temporary" ModalProps={{ keepMounted: true }} sx={drawerStyles}>
          <Toolbar />
          <List component="nav">
            {menuItems.map((item) => (
              item.permission && (
                <React.Fragment key={item.text}>
                  <ListItem
                    button
                    onClick={() => item.action ? handleMenuClick(item.action) : toggleSection(item.text.toLowerCase())}
                    sx={selectedMenu === item.action ? selectedItemStyles : null} // Apply selected styles
                  >
                    <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.children && (open[item.text.toLowerCase()] ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />)}
                  </ListItem>
                  {item.children && (
                    <Collapse in={open[item.text.toLowerCase()]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child) => (
                          <ListItem
                            button
                            sx={{ pl: 4, ...(selectedMenu === child.action ? selectedItemStyles : {}) }} // Apply selected styles for child items
                            key={child.text}
                            onClick={() => handleMenuClick(child.action)}
                          >
                            <ListItemIcon sx={{ color: 'white' }}>{child.icon}</ListItemIcon>
                            <ListItemText primary={child.text} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                </React.Fragment>
              )
            ))}
          </List>
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer variant="permanent" sx={drawerStyles}>
          <Toolbar />
          <List component="nav">
            {menuItems.map((item) => (
              item.permission && (
                <React.Fragment key={item.text}>
                  <ListItem
                    button
                    onClick={() => item.action ? handleMenuClick(item.action) : toggleSection(item.text.toLowerCase())}
                    sx={selectedMenu === item.action ? selectedItemStyles : null} // Apply selected styles
                  >
                    <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={<Typography>{item.text}</Typography>} />
                    {item.children && (open[item.text.toLowerCase()] ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />)}
                  </ListItem>
                  {item.children && (
                    <Collapse in={open[item.text.toLowerCase()]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child) => (
                          <ListItem
                            button
                            sx={{ pl: 4, ...(selectedMenu === child.action ? selectedItemStyles : {}) }} // Apply selected styles for child items
                            key={child.text}
                            onClick={() => handleMenuClick(child.action)}
                          >
                            <ListItemIcon sx={{ color: 'white' }}>{child.icon}</ListItemIcon>
                            <ListItemText primary={<Typography>{child.text}</Typography>} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                </React.Fragment>
              )
            ))}
          </List>
        </Drawer>
      </Hidden>
    </>
  );
}

export default Sidebar;
