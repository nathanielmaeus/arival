import * as React from "react";
import { Route, RouteProps, BrowserRouter, Redirect } from "react-router-dom";
import { Loading } from "src/components/atoms/loading";

const HeadLinesPage = React.lazy(() => import("../pages/main/main"));
const ArticlePage = React.lazy(() => import("../pages/article/article"));

const Routes: React.FC<RouteProps> = () => (
  <BrowserRouter>
    <React.Suspense fallback={<Loading />}>
      <Route exact path="/" render={() => <Redirect to="/news" />} />
      <Route exact path="/news" component={HeadLinesPage} />
      <Route exact path="/news/:id" component={ArticlePage} />
    </React.Suspense>
  </BrowserRouter>
);

export default Routes;
