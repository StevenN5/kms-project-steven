import React from 'react';
import HomePagePublic from './HomePagePublic';
import HomePageLoggedIn from './HomePageLoggedIn';

const HomePage = () => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  // Tampilkan HomePagePublic untuk semua orang
  // Tampilkan HomePageLoggedIn hanya jika user sudah login
  return userInfo ? <HomePageLoggedIn userInfo={userInfo} /> : <HomePagePublic />;
};

export default HomePage;