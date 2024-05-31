import React, { useState, useEffect } from 'react';
import UserRequests from '../api/UserRequests';
import axios from 'axios';

const mockUserData = {
  name: "",
  email: "",
  mobileNumber: "",
  gender: "",
  premiumMember: true,
  dateOfBirth: "",
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  },
  profilePicture: "https://via.placeholder.com/150",
  orderHistory: [
    { orderId: "001", date: "2024-05-01", amount: "$50.00", status: "Delivered", items: ["Product 1", "Product 2"] },
    { orderId: "002", date: "2024-05-15", amount: "$30.00", status: "Shipped", items: ["Product 3"] },
    { orderId: "003", date: "2024-05-20", amount: "$70.00", status: "Processing", items: ["Product 4", "Product 5"] },
  ]
};

export const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState(null);

  const UserId = localStorage.getItem("userId");
  console.log(UserId);

  useEffect(() => {
    UserRequests.getUserById(UserId).then(
      (response) => {
        console.log(response.data);
        setUserData(response.data);
      }
    ).catch (
    (error) => { 
      console.log(error)
      setUserData(mockUserData); 
    } 
    );
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdatedUserData(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');

    if (subKey) {
      setUpdatedUserData({ 
        ...updatedUserData, 
        [mainKey]: { 
          ...updatedUserData[mainKey], 
          [subKey]: value 
        } 
      });
    } else {
      setUpdatedUserData({ ...updatedUserData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUpdatedUserData({ ...updatedUserData, profilePicture: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updatedUserData.id = 2;
    setUpdatedUserData(updatedUserData);
    alert("Are you sure you want to save this data ?");
    axios.put('http://localhost:8083/services/api/um/users', updatedUserData)
    .then(response => {
      console.log("User data saved:", response.data);
      setUserData(updatedUserData); 
      setIsEditing(false); 
    })
    .catch(error => {
      console.error("Error saving user data:", error);
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>User Profile</h1>
      <div style={styles.section}>
        <h2>Personal Information</h2>
        <div style={styles.profilePictureContainer}>
          <img src={userData.profilePicture} alt="Profile" style={styles.profilePicture} />
          {isEditing && (
            <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
          )}
        </div>
        {isEditing ? (
          <div>
            <table>
              <tbody>
                <tr>
                  <td><label>Name:</label></td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={updatedUserData.name}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Email:</label></td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={updatedUserData.email}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Mobile Number:</label></td>
                  <td>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={updatedUserData.mobileNumber}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Gender:</label></td>
                  <td>
                    <select
                      name="gender"
                      value={updatedUserData.gender}
                      onChange={handleChange}
                      style={styles.input}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><label>Premium Member:</label></td>
                  <td>
                    <input
                      type="checkbox"
                      name="premiumMember"
                      checked={updatedUserData.premiumMember}
                      onChange={(e) => handleChange({ target: { name: 'premiumMember', value: e.target.checked } })}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Date of Birth:</label></td>
                  <td>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={updatedUserData.dateOfBirth}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2"><strong>Address</strong></td>
                </tr>
                <tr>
                  <td><label>Street:</label></td>
                  <td>
                    <input
                      type="text"
                      name="address.street"
                      value={updatedUserData.address.street}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>City:</label></td>
                  <td>
                    <input
                      type="text"
                      name="address.city"
                      value={updatedUserData.address.city}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>State:</label></td>
                  <td>
                    <input
                      type="text"
                      name="address.state"
                      value={updatedUserData.address.state}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Postal Code:</label></td>
                  <td>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={updatedUserData.address.postalCode}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Country:</label></td>
                  <td>
                    <input
                      type="text"
                      name="address.country"
                      value={updatedUserData.address.country}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={handleSave} style={styles.button}>Save</button>
          </div>
        ) : (
          <div>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Mobile Number:</strong> {userData.mobileNumber}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>Premium Member:</strong> {userData.premiumMember ? 'Yes' : 'No'}</p>
            <p><strong>Date of Birth:</strong> {userData.dateOfBirth}</p>
            <p><strong>Address:</strong></p>
            <p>{userData.address.street}, {userData.address.city}, {userData.address.state}, {userData.address.postalCode}, {userData.address.country}</p>
            <button onClick={handleEditToggle} style={styles.button}>Edit</button>
          </div>
        )}
      </div>
      {/* <div style={styles.section}>
        <h2>Order History</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {userData.orderHistory.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.date}</td>
                <td>{order.amount}</td>
                <td>{order.status}</td>
                <td>{order.items.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: '40px',
  },
  profilePictureContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  profilePicture: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginRight: '20px',
  },
  fileInput: {
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '5px 0',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

export default UserProfile;
