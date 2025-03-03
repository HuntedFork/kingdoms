import React from "react";
import { Route, Switch } from "react-router-dom";

import Create from "./components/pages/Create"
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import HomepageLayout from "./components/pages/Home";
import Browse from "./components/pages/Browse"
import UserPage from "./components/pages/UserPage"
import Kingdom from "./components/pages/Kingdom"
import About from "./components/pages/About"
import BugReport from "./components/pages/BugReport"
import NotFound from "./components/pages/NotFound"
import ResetPassword from "./components/pages/ResetPassword"
import ResetPasswordConfirm from "./components/pages/ResetPasswordConfirm"
import LoadCards from "./components/pages/LoadCards"

const BaseRouter = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/create" component={Create} />
    <Route path="/kingdom/:kingdomId" component={Kingdom} />
    <Route path="/users/:userId" component={UserPage} />
    <Route path="/browse" component={Browse} />
    <Route path="/about" component={About} />
    <Route path="/bug" component={BugReport} />
    <Route path="/reset-password/confirm/:uid/:token" component={ResetPasswordConfirm} />
    <Route path="/reset-password" component={ResetPassword} />
    <Route path="/utility/loadcards" component={LoadCards} />
    <Route exact path="/" component={HomepageLayout} />
    <Route component={NotFound} />
  </Switch>
);

export default BaseRouter;
