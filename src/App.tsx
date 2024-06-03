import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Venues from './components/Venues';
import Venue from './components/Venue';
import Events from './components/Events';
import Event from './components/Event';
import { Flex, Heading } from '@chakra-ui/react';

const App: React.FC = () => (
  <Router>
    <Nav />
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/venues" Component={Venues} />
      <Route path="/venues/:venueId" Component={Venue} />
      <Route path="/events" Component={Events} />
      <Route path="/events/:eventId" Component={Event} />
    </Routes>
  </Router>
);

const Nav: React.FC = () => (
  <Flex
    as="nav"
    bg="gray.700"
    color="white"
    padding="24px"
  >
    <Heading size="md">Ascential Front End Challenge</Heading>
  </Flex>
);

export default App;
