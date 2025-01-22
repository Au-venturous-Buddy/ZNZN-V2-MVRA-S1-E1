import React from "react"
import {Container, Stack} from 'react-bootstrap'
import MenuBar from "./menu-bar"
import Header from "./header"
import { useStaticQuery, graphql } from "gatsby"
import ResponsiveSize from "../hooks/responsive-size";

const HeaderMenuBar = function({show, menuBarItems}) {
  if(show) {
    return(
      <MenuBar menuBarItems={menuBarItems}></MenuBar>
    )
  }
  else {
    return(
      <div></div>
    )
  }
}

export default function Layout({ menuBarItems, children, showMenuBar, useCustomBackground }) {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title,
            author
          }
        }
      }
    `
  )
  return (
    <div className={useCustomBackground}>
      <Container fluid className="px-0 main">
        <Stack className="justify-content-center">
          <Header siteTitle={data.site.siteMetadata.title} />
          <Container fluid className="px-0">
            <main>{children}</main>
          </Container>
        </Stack>
      </Container>
      <Container fluid className="px-0 main-navbar" style={{bottom: 0, position: `fixed`, width:`100%`, zIndex:`100`}}>
        <Stack>
          <HeaderMenuBar show={showMenuBar} menuBarItems={menuBarItems} />
          <div className="footer-col">
            <footer>
              <span style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}}>
                <small>{`© ${new Date().getFullYear()} ${data.site.siteMetadata.author}`}</small>
              </span>
            </footer>
          </div>
        </Stack>
      </Container>
    </div>
  )
}