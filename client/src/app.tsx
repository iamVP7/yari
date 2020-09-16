import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// we include our base SASS here to ensure it is loaded
// and applied before any component specific style
import "./app.scss";

import { CRUD_MODE } from "./constants";
import { Homepage } from "./homepage";
import { Document } from "./document";
import { Footer } from "./ui/organisms/footer";
import { Header } from "./ui/organisms/header";
import { NoMatch } from "./routing";

const ActiveBanner = lazy(() => import("./banners/active-banner"));

const AllFlaws = lazy(() => import("./flaws"));
const DocumentEdit = lazy(() => import("./document/forms/edit"));
const DocumentCreate = lazy(() => import("./document/forms/create"));

const isServer = typeof window === "undefined";

function Layout({ pageType, children }) {
  return (
    <>
      <div className={`page-wrapper ${pageType}`}>
        <Header />
        {children}
        <Footer />
        {!isServer && (
          <Suspense fallback={null}>
            <ActiveBanner />
          </Suspense>
        )}
      </div>
    </>
  );
}

export function App(appProps) {
  const routes = (
    <Routes>
      <Route
        path="/"
        element={
          <Layout pageType="home-page">
            <Homepage />
          </Layout>
        }
      />
      <Route
        path="/:locale/*"
        element={
          <Routes>
            {CRUD_MODE && (
              <>
                <Route path="/_flaws" element={<AllFlaws />} />
                <Route path="/_create/*" element={<DocumentCreate />} />
                <Route path="/_edit/*" element={<DocumentEdit />} />
              </>
            )}
            <Route
              path="/docs/*"
              element={
                <Layout pageType="reference-page">
                  <Document {...appProps} />
                </Layout>
              }
            />
          </Routes>
        }
      />
      <Route
        path="*"
        element={
          <Layout pageType="error-page">
            <NoMatch />
          </Layout>
        }
      />
    </Routes>
  );
  /* This might look a bit odd but it's actually quite handy.
   * This way, when rendering client-side, we wrap all the routes in
   * <Suspense> but in server-side rendering that goes away.
   */
  return isServer ? (
    routes
  ) : (
    <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>
  );
}
